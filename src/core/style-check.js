import chalk from 'chalk';
import ora from 'ora';
import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { getProject, CATEGORIES } from '../projects/registry.js';
import { detectLanguage } from '../projects/detector.js';
import { showStyleReport } from '../ui/ascii.js';

/**
 * Built-in style checkers for different languages
 * Each checker returns an array of { file, line, message, severity }
 */
const STYLE_CHECKERS = {
  /**
   * C Style Checker (School 21 norminette-like)
   */
  c: {
    name: 'C Style (S21 Norm)',
    async check(dir) {
      const issues = [];
      const files = await getFilesRecursive(dir, ['.c', '.h']);

      for (const file of files) {
        const content = await readFile(file, 'utf8');
        const lines = content.split('\n');
        const relPath = file.replace(dir + '/', '');

        // Check each line
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = i + 1;

          // Line length > 80 chars
          if (line.length > 80) {
            issues.push({
              file: relPath, line: lineNum,
              message: `Line too long (${line.length} > 80 chars)`,
              severity: 'error',
            });
          }

          // Trailing whitespace
          if (line !== line.trimEnd() && line.length > 0) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'Trailing whitespace',
              severity: 'warning',
            });
          }

          // Tab instead of spaces (if that's the rule)
          // Note: School 21 actually uses tabs, so this might need adjustment
          
          // Function length check (basic heuristic)
          // Multiple consecutive blank lines
          if (i > 0 && lines[i] === '' && lines[i - 1] === '') {
            if (i > 1 && lines[i - 2] === '') {
              issues.push({
                file: relPath, line: lineNum,
                message: 'More than 2 consecutive blank lines',
                severity: 'warning',
              });
            }
          }
        }

        // Check for header (42 header or S21 header)
        if (!content.startsWith('/*') && !content.startsWith('//')) {
          issues.push({
            file: relPath, line: 1,
            message: 'Missing file header comment',
            severity: 'warning',
          });
        }

        // Check functions per file (max 5 in S21)
        const funcRegex = /^[a-zA-Z_]\w*\s+\**[a-zA-Z_]\w*\s*\([^)]*\)\s*\{/gm;
        const funcMatches = content.match(funcRegex);
        if (funcMatches && funcMatches.length > 5) {
          issues.push({
            file: relPath, line: 1,
            message: `Too many functions in file (${funcMatches.length} > 5)`,
            severity: 'error',
          });
        }
      }

      return issues;
    },
  },

  /**
   * C++ Style Checker
   */
  cpp: {
    name: 'C++ Style (Google/S21)',
    async check(dir) {
      const issues = [];
      const files = await getFilesRecursive(dir, ['.cpp', '.hpp', '.cc', '.h']);

      for (const file of files) {
        const content = await readFile(file, 'utf8');
        const lines = content.split('\n');
        const relPath = file.replace(dir + '/', '');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = i + 1;

          if (line.length > 80) {
            issues.push({
              file: relPath, line: lineNum,
              message: `Line too long (${line.length} > 80 chars)`,
              severity: 'error',
            });
          }

          if (line !== line.trimEnd() && line.length > 0) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'Trailing whitespace',
              severity: 'warning',
            });
          }

          // using namespace std
          if (line.includes('using namespace std')) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'Avoid "using namespace std"',
              severity: 'warning',
            });
          }
        }
      }

      return issues;
    },
  },

  /**
   * Python Style Checker (PEP8 basics)
   */
  python: {
    name: 'Python Style (PEP8)',
    async check(dir) {
      const issues = [];
      const files = await getFilesRecursive(dir, ['.py']);

      for (const file of files) {
        const content = await readFile(file, 'utf8');
        const lines = content.split('\n');
        const relPath = file.replace(dir + '/', '');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = i + 1;

          if (line.length > 79) {
            issues.push({
              file: relPath, line: lineNum,
              message: `Line too long (${line.length} > 79 chars)`,
              severity: 'warning',
            });
          }

          // Mixed tabs and spaces
          if (line.match(/^\t+ /) || line.match(/^ +\t/)) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'Mixed tabs and spaces',
              severity: 'error',
            });
          }

          if (line !== line.trimEnd() && line.length > 0) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'Trailing whitespace',
              severity: 'warning',
            });
          }
        }
      }

      return issues;
    },
  },

  /**
   * JavaScript/TypeScript Style Checker
   */
  javascript: {
    name: 'JavaScript Style',
    async check(dir) {
      const issues = [];
      const files = await getFilesRecursive(dir, ['.js', '.jsx', '.ts', '.tsx']);

      for (const file of files) {
        if (file.includes('node_modules')) continue;
        
        const content = await readFile(file, 'utf8');
        const lines = content.split('\n');
        const relPath = file.replace(dir + '/', '');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = i + 1;

          if (line.length > 100) {
            issues.push({
              file: relPath, line: lineNum,
              message: `Line too long (${line.length} > 100 chars)`,
              severity: 'warning',
            });
          }

          // console.log in production code
          if (line.includes('console.log') && !file.includes('test')) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'console.log found (remove before submission)',
              severity: 'warning',
            });
          }

          // var usage
          if (line.match(/\bvar\s+/)) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'Use let/const instead of var',
              severity: 'warning',
            });
          }
        }
      }

      return issues;
    },
  },

  /**
   * Bash/Shell Style Checker
   */
  bash: {
    name: 'Shell Script Style',
    async check(dir) {
      const issues = [];
      const files = await getFilesRecursive(dir, ['.sh']);

      for (const file of files) {
        const content = await readFile(file, 'utf8');
        const lines = content.split('\n');
        const relPath = file.replace(dir + '/', '');

        // Check shebang
        if (!lines[0]?.startsWith('#!')) {
          issues.push({
            file: relPath, line: 1,
            message: 'Missing shebang (#!/bin/bash)',
            severity: 'error',
          });
        }

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = i + 1;

          if (line.length > 80) {
            issues.push({
              file: relPath, line: lineNum,
              message: `Line too long (${line.length} > 80 chars)`,
              severity: 'warning',
            });
          }
        }
      }

      return issues;
    },
  },

  /**
   * SQL Style Checker
   */
  sql: {
    name: 'SQL Style',
    async check(dir) {
      const issues = [];
      const files = await getFilesRecursive(dir, ['.sql']);

      for (const file of files) {
        const content = await readFile(file, 'utf8');
        const lines = content.split('\n');
        const relPath = file.replace(dir + '/', '');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = i + 1;

          // SELECT * usage
          if (line.match(/SELECT\s+\*/i)) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'Avoid SELECT * — specify columns explicitly',
              severity: 'warning',
            });
          }
        }
      }

      return issues;
    },
  },

  /**
   * Docker Style Checker
   */
  docker: {
    name: 'Dockerfile Style',
    async check(dir) {
      const issues = [];
      const files = await getFilesRecursive(dir, ['Dockerfile']);

      for (const file of files) {
        const content = await readFile(file, 'utf8');
        const lines = content.split('\n');
        const relPath = file.replace(dir + '/', '');

        let hasFrom = false;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          const lineNum = i + 1;

          if (line.startsWith('FROM')) hasFrom = true;

          // Using latest tag
          if (line.match(/FROM\s+\S+:latest/)) {
            issues.push({
              file: relPath, line: lineNum,
              message: 'Avoid using :latest tag — pin version',
              severity: 'warning',
            });
          }

          // RUN with multiple commands without &&
          if (line.startsWith('RUN') && !line.includes('&&') && !line.includes('\\')) {
            // This is ok for single commands, skip
          }
        }

        if (!hasFrom) {
          issues.push({
            file: relPath, line: 1,
            message: 'Dockerfile missing FROM instruction',
            severity: 'error',
          });
        }
      }

      return issues;
    },
  },
};

/**
 * Recursively get files with specific extensions
 */
async function getFilesRecursive(dir, extensions) {
  const results = [];
  
  async function walk(currentDir) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', '.verter-tmp', 'build', 'obj'].includes(entry.name)) {
            await walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = extname(entry.name);
          const nameMatch = extensions.some(e => 
            e.startsWith('.') ? ext === e : entry.name === e
          );
          if (nameMatch) {
            results.push(fullPath);
          }
        }
      }
    } catch {}
  }

  await walk(dir);
  return results;
}

/**
 * Run style check for a project
 */
export async function runStyleCheck(projectId, options = {}) {
  const dir = options.dir || '.';
  let language;

  if (projectId) {
    const project = getProject(projectId);
    if (project) {
      language = project.language;
      const cat = CATEGORIES[project.category];
      console.log(`  ${cat.icon} ${chalk.hex(cat.color).bold('Style Check:')} ${project.name}`);
    }
  }

  if (!language) {
    language = await detectLanguage(dir);
  }

  if (!language) {
    console.log(chalk.yellow('  ⚠️  Could not detect project language for style checking.\n'));
    return;
  }

  const checker = STYLE_CHECKERS[language];
  if (!checker) {
    console.log(chalk.yellow(`  ⚠️  No built-in style checker for ${language}.\n`));
    return;
  }

  console.log(chalk.gray(`  Using: ${checker.name}`));
  console.log(chalk.gray('  ' + '─'.repeat(40) + '\n'));

  const spinner = ora({
    text: chalk.cyan('Checking code style...'),
    prefixText: '  ',
    spinner: 'dots12',
  }).start();

  try {
    const issues = await checker.check(dir);
    spinner.stop();
    showStyleReport(issues);
  } catch (err) {
    spinner.fail(chalk.red(`Style check failed: ${err.message}`));
  }
}

export { STYLE_CHECKERS };
