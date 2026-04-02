import inquirer from 'inquirer';
import chalk from 'chalk';
import { PROJECTS, CATEGORIES, getProjectsByCategory } from '../projects/registry.js';
import { runTests } from './runner.js';
import { runStyleCheck } from './style-check.js';
import { detectProject } from '../projects/detector.js';
import { loadTestModule } from './loader.js';

/**
 * Interactive mode - beautiful TUI for selecting and running tests
 */
export async function runInteractive(options = {}) {
  const action = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('What do you want to do?'),
      choices: [
        { name: `${chalk.green('🧪')} Run Tests`, value: 'test' },
        { name: `${chalk.yellow('🎨')} Style Check Only`, value: 'style' },
        { name: `${chalk.blue('📋')} List Projects`, value: 'list' },
        { name: `${chalk.magenta('🔍')} Auto-detect Project`, value: 'detect' },
        new inquirer.Separator(),
        { name: `${chalk.red('👋')} Exit`, value: 'exit' },
      ],
      prefix: '  ',
    },
  ]);

  switch (action.action) {
    case 'test':
      await selectAndRunTests(options);
      break;
    case 'style':
      await selectAndRunStyle(options);
      break;
    case 'list':
      await interactiveList();
      break;
    case 'detect':
      await interactiveDetect(options);
      break;
    case 'exit':
      console.log(chalk.gray('\n  See you later, alligator! 🐊\n'));
      process.exit(0);
  }
}

/**
 * Select a project category, then project, then run tests
 */
async function selectAndRunTests(options) {
  const project = await selectProject();
  if (!project) return;

  const { dir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'dir',
      message: chalk.cyan('Project directory:'),
      default: '.',
      prefix: '  ',
    },
  ]);

  const { verbose } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'verbose',
      message: chalk.cyan('Verbose output?'),
      default: false,
      prefix: '  ',
    },
  ]);

  console.log('');
  await runTests(project.id, { ...options, dir, verbose });
}

/**
 * Select a project and run only style checks
 */
async function selectAndRunStyle(options) {
  const project = await selectProject();
  if (!project) return;

  const { dir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'dir',
      message: chalk.cyan('Project directory:'),
      default: '.',
      prefix: '  ',
    },
  ]);

  console.log('');
  await runStyleCheck(project.id, { ...options, dir });
}

/**
 * Interactive project selection
 */
async function selectProject() {
  // First select category
  const categoryChoices = Object.entries(CATEGORIES).map(([id, cat]) => {
    const count = PROJECTS.filter(p => p.category === id).length;
    return {
      name: `${cat.icon} ${chalk.hex(cat.color).bold(cat.name)} ${chalk.gray(`(${count} projects)`)}`,
      value: id,
    };
  });

  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: chalk.cyan('Select category:'),
      choices: categoryChoices,
      pageSize: 15,
      prefix: '  ',
    },
  ]);

  // Then select project
  const projects = getProjectsByCategory(category);
  const projectChoices = projects.map(p => ({
    name: `${chalk.white(p.name)} ${chalk.gray('— ' + p.description)}`,
    value: p,
  }));

  projectChoices.push(new inquirer.Separator());
  projectChoices.push({ name: chalk.gray('← Back'), value: null });

  const { project } = await inquirer.prompt([
    {
      type: 'list',
      name: 'project',
      message: chalk.cyan('Select project:'),
      choices: projectChoices,
      pageSize: 20,
      prefix: '  ',
    },
  ]);

  return project;
}

/**
 * Interactive list
 */
async function interactiveList() {
  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: chalk.cyan('Filter by category?'),
      choices: [
        { name: chalk.white('📚 All categories'), value: null },
        new inquirer.Separator(),
        ...Object.entries(CATEGORIES).map(([id, cat]) => ({
          name: `${cat.icon} ${cat.name}`,
          value: id,
        })),
      ],
      pageSize: 20,
      prefix: '  ',
    },
  ]);

  const { listProjects } = await import('../projects/registry.js');
  await listProjects(category);
}

/**
 * Auto-detect and offer to run
 */
async function interactiveDetect(options) {
  const { dir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'dir',
      message: chalk.cyan('Directory to scan:'),
      default: '.',
      prefix: '  ',
    },
  ]);

  console.log('');
  const detected = await detectProject(dir);

  if (detected) {
    console.log(chalk.green(`  🔍 Detected: ${chalk.bold(detected.name)}`));
    console.log(chalk.gray(`     ${detected.description}\n`));

    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: chalk.cyan('Run tests for this project?'),
        default: true,
        prefix: '  ',
      },
    ]);

    if (proceed) {
      await runTests(detected.id, { ...options, dir });
    }
  } else {
    console.log(chalk.yellow('  🤷 Could not auto-detect project.'));
    console.log(chalk.gray('  Try selecting manually with "verter run"\n'));
  }
}
