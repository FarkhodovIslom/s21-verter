#!/usr/bin/env node

import { Command } from 'commander';
import { showBanner } from '../src/ui/ascii.js';
import { runInteractive } from '../src/core/interactive.js';
import { runTests } from '../src/core/runner.js';
import { runStyleCheck } from '../src/core/style-check.js';
import { listProjects } from '../src/projects/registry.js';
import { detectProject } from '../src/projects/detector.js';
import chalk from 'chalk';

const program = new Command();

program
  .name('verter')
  .description('🔥 S21 Verter — Custom auto-tester for School 21 projects')
  .version('1.0.0');

// Default: interactive mode
program
  .command('run [project]')
  .description('Run tests for a project (interactive if no project specified)')
  .option('-d, --dir <path>', 'Project directory', '.')
  .option('-v, --verbose', 'Verbose output', false)
  .option('--no-style', 'Skip style checks')
  .action(async (project, options) => {
    await showBanner();
    
    if (!project) {
      // Try auto-detect
      const detected = await detectProject(options.dir);
      if (detected) {
        console.log(chalk.cyan(`  🔍 Auto-detected project: ${chalk.bold(detected.name)}\n`));
        project = detected.id;
      }
    }

    if (!project) {
      // Interactive mode
      await runInteractive(options);
    } else {
      await runTests(project, options);
    }
  });

program
  .command('style [project]')
  .description('Run only style/norm checks')
  .option('-d, --dir <path>', 'Project directory', '.')
  .action(async (project, options) => {
    await showBanner();
    await runStyleCheck(project, options);
  });

program
  .command('list')
  .description('List all available project tests')
  .option('-c, --category <cat>', 'Filter by category')
  .action(async (options) => {
    await showBanner();
    await listProjects(options.category);
  });

program
  .command('info <project>')
  .description('Show info about a specific project test module')
  .action(async (project) => {
    await showBanner();
    const { showProjectInfo } = await import('../src/projects/registry.js');
    await showProjectInfo(project);
  });

// If no command, show interactive
if (process.argv.length <= 2) {
  (async () => {
    await showBanner();
    await runInteractive({});
  })();
} else {
  program.parse();
}
