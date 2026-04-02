import chalk from 'chalk';
import ora from 'ora';
import { loadTestModule, validateModule } from './loader.js';
import { getProject, CATEGORIES } from '../projects/registry.js';
import { showTestResult, showFinalReport, showError, renderProgressBar } from '../ui/ascii.js';
import { runStyleCheck } from './style-check.js';

/**
 * Test execution context passed to each test function
 */
class TestContext {
  constructor(projectDir, options = {}) {
    this.projectDir = projectDir;
    this.verbose = options.verbose || false;
    this.tempFiles = [];
  }

  /**
   * Assert that a condition is true
   */
  assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new TestError(message);
    }
  }

  /**
   * Assert equality
   */
  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new TestError(
        message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
      );
    }
  }

  /**
   * Assert that value matches regex
   */
  assertMatch(value, regex, message) {
    if (!regex.test(value)) {
      throw new TestError(
        message || `Expected "${value}" to match ${regex}`
      );
    }
  }

  /**
   * Assert that a value is truthy
   */
  assertTruthy(value, message) {
    if (!value) {
      throw new TestError(message || `Expected truthy value, got ${JSON.stringify(value)}`);
    }
  }

  /**
   * Assert file exists
   */
  async assertFileExists(path, message) {
    const { access } = await import('fs/promises');
    const { join } = await import('path');
    const fullPath = join(this.projectDir, path);
    try {
      await access(fullPath);
    } catch {
      throw new TestError(message || `File not found: ${path}`);
    }
  }

  /**
   * Execute a shell command in the project directory
   */
  async exec(command, options = {}) {
    const { execSync } = await import('child_process');
    const timeout = options.timeout || 30000;
    
    try {
      const result = execSync(command, {
        cwd: this.projectDir,
        timeout,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        ...options,
      });
      return { stdout: result, stderr: '', exitCode: 0 };
    } catch (err) {
      return {
        stdout: err.stdout || '',
        stderr: err.stderr || '',
        exitCode: err.status || 1,
      };
    }
  }

  /**
   * Read a file from the project directory
   */
  async readFile(path) {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    return readFile(join(this.projectDir, path), 'utf8');
  }

  /**
   * Check if a file exists
   */
  async fileExists(path) {
    const { access } = await import('fs/promises');
    const { join } = await import('path');
    try {
      await access(join(this.projectDir, path));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Write a temp file for testing
   */
  async writeTempFile(name, content) {
    const { writeFile } = await import('fs/promises');
    const { join } = await import('path');
    const path = join(this.projectDir, '.verter-tmp', name);
    const { mkdir } = await import('fs/promises');
    await mkdir(join(this.projectDir, '.verter-tmp'), { recursive: true });
    await writeFile(path, content);
    this.tempFiles.push(path);
    return path;
  }

  /**
   * Cleanup temp files
   */
  async cleanup() {
    const { rm } = await import('fs/promises');
    const { join } = await import('path');
    try {
      await rm(join(this.projectDir, '.verter-tmp'), { recursive: true, force: true });
    } catch {}
  }
}

class TestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TestError';
  }
}

/**
 * Run a single test with timeout
 */
async function runSingleTest(test, ctx) {
  const timeout = test.timeout || 10000;
  const start = Date.now();

  try {
    await Promise.race([
      test.run(ctx),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
      ),
    ]);

    return {
      name: test.name,
      passed: true,
      duration: Date.now() - start,
      error: null,
    };
  } catch (err) {
    return {
      name: test.name,
      passed: false,
      duration: Date.now() - start,
      error: err.message,
    };
  }
}

/**
 * Run all tests for a project
 */
export async function runTests(projectId, options = {}) {
  const project = getProject(projectId);
  if (!project) {
    showError(`Project "${projectId}" not found in registry.`);
    console.log(chalk.gray('  Run "verter list" to see available projects.\n'));
    return;
  }

  const cat = CATEGORIES[project.category];
  console.log(`  ${cat.icon} ${chalk.hex(cat.color).bold(project.name)}`);
  console.log(chalk.gray(`  ${project.description}`));
  console.log(chalk.gray('  ' + '─'.repeat(50) + '\n'));

  // Load test module
  const spinner = ora({
    text: chalk.cyan('Loading test module...'),
    prefixText: '  ',
    spinner: 'dots12',
  }).start();

  const module = await loadTestModule(projectId);

  if (!module) {
    spinner.fail(chalk.red('No test module found for this project.'));
    console.log('');
    console.log(chalk.yellow('  📦 To create a test module, add a file:'));
    console.log(chalk.gray(`     ~/.verter/tests/${projectId}.js`));
    console.log(chalk.gray(`     or .verter/tests/${projectId}.js in your project\n`));
    console.log(chalk.cyan('  💡 Template:'));
    console.log(chalk.gray(getModuleTemplate(projectId, project)));
    return;
  }

  // Validate module
  const validation = validateModule(module);
  if (!validation.valid) {
    spinner.fail(chalk.red('Invalid test module:'));
    for (const err of validation.errors) {
      console.log(chalk.red(`    ✗ ${err}`));
    }
    return;
  }

  spinner.succeed(chalk.green(`Loaded: ${module.name} v${module.version || '1.0.0'}`));
  console.log('');

  const projectDir = options.dir || '.';
  const ctx = new TestContext(projectDir, options);
  const allResults = [];

  // Run setup
  if (module.setup) {
    const setupSpinner = ora({
      text: chalk.cyan('Running setup...'),
      prefixText: '  ',
      spinner: 'dots12',
    }).start();
    
    try {
      await module.setup(projectDir);
      setupSpinner.succeed(chalk.green('Setup complete'));
    } catch (err) {
      setupSpinner.fail(chalk.red(`Setup failed: ${err.message}`));
      return;
    }
  }

  // Run each suite
  for (const suite of module.suites) {
    console.log(`\n  ${chalk.white.bold('📋 ' + suite.name)}`);
    console.log(chalk.gray('  ' + '─'.repeat(40)));

    const suiteResults = {
      name: suite.name,
      passed: 0,
      failed: 0,
      total: suite.tests.length,
      duration: 0,
      tests: [],
    };

    for (const test of suite.tests) {
      const testSpinner = ora({
        text: chalk.gray(test.name),
        prefixText: '    ',
        spinner: 'dots',
      }).start();

      const result = await runSingleTest(test, ctx);
      suiteResults.duration += result.duration;
      suiteResults.tests.push(result);

      if (result.passed) {
        suiteResults.passed++;
        testSpinner.succeed(
          chalk.green('✓ ') + chalk.white(test.name) + chalk.gray(` (${result.duration}ms)`)
        );
      } else {
        suiteResults.failed++;
        testSpinner.fail(
          chalk.red('✗ ') + chalk.white(test.name) + chalk.gray(` (${result.duration}ms)`)
        );
        if (result.error && (options.verbose || true)) {
          console.log(chalk.red(`      → ${result.error}`));
        }
      }
    }

    allResults.push(suiteResults);
    
    // Suite summary
    showTestResult(
      suite.name,
      suiteResults.passed,
      suiteResults.total,
      suiteResults.duration
    );
  }

  // Style check (if not disabled)
  if (options.style !== false && module.styleChecks) {
    console.log(`\n  ${chalk.white.bold('🎨 Style Checks')}`);
    console.log(chalk.gray('  ' + '─'.repeat(40)));
    
    for (const check of module.styleChecks) {
      const styleSpinner = ora({
        text: chalk.gray(check.name),
        prefixText: '    ',
        spinner: 'dots',
      }).start();

      try {
        const issues = await check.check(projectDir);
        if (issues.length === 0) {
          styleSpinner.succeed(chalk.green('✓ ') + chalk.white(check.name));
        } else {
          styleSpinner.warn(
            chalk.yellow('⚠ ') + chalk.white(check.name) + chalk.yellow(` (${issues.length} issues)`)
          );
          for (const issue of issues.slice(0, 5)) {
            const sev = issue.severity === 'error' ? chalk.red('ERR') : chalk.yellow('WRN');
            console.log(`      ${sev} ${chalk.gray(issue.file + ':' + issue.line)} ${issue.message}`);
          }
          if (issues.length > 5) {
            console.log(chalk.gray(`      ... and ${issues.length - 5} more`));
          }
        }
      } catch (err) {
        styleSpinner.fail(chalk.red(`✗ ${check.name}: ${err.message}`));
      }
    }
  }

  // Teardown
  if (module.teardown) {
    try { await module.teardown(projectDir); } catch {}
  }

  // Cleanup
  await ctx.cleanup();

  // Final report
  const reportData = allResults.map(s => ({
    name: s.name,
    passed: s.passed,
    total: s.total,
    duration: s.duration,
  }));

  showFinalReport(reportData);
}

/**
 * Generate a test module template
 */
function getModuleTemplate(projectId, project) {
  return `
  export default {
    id: '${projectId}',
    name: '${project.name} Tests',
    version: '1.0.0',
    language: '${project.language}',

    async setup(projectDir) {
      // Build project, install deps, etc.
    },

    suites: [
      {
        name: 'Compilation',
        tests: [
          {
            name: 'Project compiles without errors',
            async run(ctx) {
              const result = await ctx.exec('make');
              ctx.assert(result.exitCode === 0, 'Compilation failed');
            },
          },
        ],
      },
      {
        name: 'Functionality',
        tests: [
          {
            name: 'Basic test',
            async run(ctx) {
              // Your test logic here
              ctx.assert(true, 'Test passed');
            },
          },
        ],
      },
    ],

    styleChecks: [
      {
        name: 'Code Style',
        async check(projectDir) {
          return []; // Return array of { file, line, message, severity }
        },
      },
    ],
  };`;
}

export { TestContext, TestError };
