import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import chalk from 'chalk';

const VERTER_GRADIENT = gradient(['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3']);
const SUCCESS_GRADIENT = gradient(['#00b894', '#00cec9', '#0984e3']);
const FAIL_GRADIENT = gradient(['#ff6b6b', '#e17055', '#d63031']);
const INFO_GRADIENT = gradient(['#a29bfe', '#6c5ce7', '#fd79a8']);

export async function showBanner() {
  const text = figlet.textSync('S21 VERTER', {
    font: 'ANSI Shadow',
    horizontalLayout: 'fitted',
  });

  console.log('\n' + VERTER_GRADIENT(text));
  console.log(
    chalk.gray('  ─────────────────────────────────────────────────────────')
  );
  console.log(
    chalk.gray('  ') +
    chalk.white.bold('v1.0.0') +
    chalk.gray(' │ ') +
    chalk.cyan('School 21 Project Auto-Tester') +
    chalk.gray(' │ ') +
    chalk.yellow('by Hanzo Dev')
  );
  console.log(
    chalk.gray('  ─────────────────────────────────────────────────────────\n')
  );
}

export function showSuccess(message) {
  console.log(
    boxen(SUCCESS_GRADIENT(message), {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'green',
    })
  );
}

export function showError(message) {
  console.log(
    boxen(FAIL_GRADIENT(message), {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'red',
    })
  );
}

export function showInfo(message) {
  console.log(
    boxen(INFO_GRADIENT(message), {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'magenta',
    })
  );
}

export function showTestResult(name, passed, total, duration) {
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
  const bar = renderProgressBar(pct, 30);
  const status = passed === total
    ? chalk.green.bold('✅ PASS')
    : chalk.red.bold('❌ FAIL');

  console.log(
    `  ${status} ${chalk.white.bold(name)} ${bar} ${chalk.cyan(passed)}/${chalk.white(total)} ${chalk.gray(`(${duration}ms)`)}`
  );
}

export function renderProgressBar(percent, width = 30) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  
  let color;
  if (percent >= 90) color = chalk.green;
  else if (percent >= 70) color = chalk.yellow;
  else if (percent >= 50) color = chalk.hex('#FFA500');
  else color = chalk.red;

  const bar = color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  return `${chalk.gray('[')}${bar}${chalk.gray(']')} ${color.bold(percent + '%')}`;
}

export function showFinalReport(results) {
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = totalTests - totalPassed;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const allPassed = totalPassed === totalTests;

  console.log('\n' + chalk.gray('  ═══════════════════════════════════════════════════'));
  console.log(chalk.white.bold('  📊 FINAL REPORT'));
  console.log(chalk.gray('  ═══════════════════════════════════════════════════\n'));

  console.log(`  ${chalk.cyan('Total Tests:')}    ${chalk.white.bold(totalTests)}`);
  console.log(`  ${chalk.green('Passed:')}         ${chalk.green.bold(totalPassed)}`);
  console.log(`  ${chalk.red('Failed:')}         ${chalk.red.bold(totalFailed)}`);
  console.log(`  ${chalk.yellow('Duration:')}       ${chalk.white(totalDuration + 'ms')}`);
  console.log(`  ${chalk.magenta('Success Rate:')}   ${renderProgressBar(Math.round((totalPassed / totalTests) * 100))}`);

  console.log('');

  if (allPassed) {
    const art = `
    ██╗   ██╗███████╗██████╗ ██████╗ ██╗ ██████╗████████╗██╗
    ██║   ██║██╔════╝██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝██║
    ██║   ██║█████╗  ██████╔╝██║  ██║██║██║        ██║   ██║
    ╚██╗ ██╔╝██╔══╝  ██╔══██╗██║  ██║██║██║        ██║   ╚═╝
     ╚████╔╝ ███████╗██║  ██║██████╔╝██║╚██████╗   ██║   ██╗
      ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝   ╚═╝   ╚═╝`;
    console.log(SUCCESS_GRADIENT(art));
    console.log(chalk.green.bold('\n  🎉 All tests passed! Go submit that shit! 🚀\n'));
  } else {
    const art = `
    ███████╗ █████╗ ██╗██╗     ███████╗██████╗ 
    ██╔════╝██╔══██╗██║██║     ██╔════╝██╔══██╗
    █████╗  ███████║██║██║     █████╗  ██║  ██║
    ██╔══╝  ██╔══██║██║██║     ██╔══╝  ██║  ██║
    ██║     ██║  ██║██║███████╗███████╗██████╔╝
    ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝`;
    console.log(FAIL_GRADIENT(art));
    console.log(chalk.red.bold('\n  💀 Fix your code before submitting, brother.\n'));
  }
}

export function showStyleReport(issues) {
  if (issues.length === 0) {
    console.log(chalk.green.bold('  ✨ Style check passed! Your code is clean af.\n'));
    return;
  }

  console.log(chalk.red.bold(`  ⚠️  Found ${issues.length} style issue(s):\n`));

  for (const issue of issues) {
    const severity = issue.severity === 'error'
      ? chalk.red.bold('ERROR')
      : chalk.yellow.bold('WARN');
    
    console.log(
      `  ${severity} ${chalk.gray(issue.file + ':' + issue.line)} ${chalk.white(issue.message)}`
    );
  }
  console.log('');
}

export { VERTER_GRADIENT, SUCCESS_GRADIENT, FAIL_GRADIENT, INFO_GRADIENT };
