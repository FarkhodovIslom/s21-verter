/**
 * S21 Verter Test Module Template
 * 
 * Copy this file and customize it for your project.
 * Save as: ~/.verter/tests/<project-id>.js
 * Or:      .verter/tests/<project-id>.js (in project dir)
 * 
 * Find project IDs with: verter list
 */

export default {
  // Must match a project ID from the registry
  id: 'PROJECT_ID_HERE',
  name: 'Project Name Tests',
  version: '1.0.0',
  language: 'c', // c, cpp, python, javascript, java, go, etc.

  /**
   * Called before any tests run.
   * Use for: compiling, installing deps, creating test fixtures
   */
  async setup(projectDir) {
    // Example: compile the project
    // const { execSync } = await import('child_process');
    // execSync('make', { cwd: projectDir });
  },

  /**
   * Test suites — group related tests together
   */
  suites: [
    {
      name: 'Build',
      tests: [
        {
          name: 'Makefile exists',
          async run(ctx) {
            await ctx.assertFileExists('Makefile');
          },
        },
        {
          name: 'Project compiles',
          timeout: 30000, // ms, default is 10000
          async run(ctx) {
            const result = await ctx.exec('make');
            ctx.assert(result.exitCode === 0, `Build failed: ${result.stderr}`);
          },
        },
      ],
    },
    {
      name: 'Functionality',
      tests: [
        {
          name: 'Basic test example',
          async run(ctx) {
            // ctx.assert(condition, message)
            // ctx.assertEqual(actual, expected, message)
            // ctx.assertMatch(string, regex, message)
            // ctx.assertTruthy(value, message)
            // ctx.assertFileExists(path, message)
            
            // Execute commands:
            // const result = await ctx.exec('command');
            // result.stdout, result.stderr, result.exitCode
            
            // Read files:
            // const content = await ctx.readFile('path/to/file');
            
            // Check file exists:
            // const exists = await ctx.fileExists('path');
            
            // Create temp test files:
            // await ctx.writeTempFile('test.txt', 'content');
            
            ctx.assert(true, 'This test always passes');
          },
        },
      ],
    },
  ],

  /**
   * Style checks specific to this project (optional)
   */
  styleChecks: [
    {
      name: 'Custom Style Check',
      async check(projectDir) {
        // Return array of issues:
        // { file: 'main.c', line: 42, message: 'Description', severity: 'error'|'warning' }
        return [];
      },
    },
  ],

  /**
   * Cleanup after all tests (optional)
   */
  async teardown(projectDir) {
    // Cleanup temp files, restore state, etc.
  },
};
