/**
 * S21 Verter Test Module: C3_s21_stringplus
 * 
 * Tests for the s21_string.h library — reimplementation of string.h
 */

export default {
  id: 'c-s21-stringplus',
  name: 'C3_s21_stringplus Tests',
  version: '1.0.0',
  language: 'c',

  async setup(projectDir) {},

  suites: [
    {
      name: 'Build & Structure',
      tests: [
        {
          name: 'Makefile exists',
          async run(ctx) {
            await ctx.assertFileExists('Makefile');
          },
        },
        {
          name: 's21_string.h header exists',
          async run(ctx) {
            const exists = await ctx.fileExists('s21_string.h') ||
                           await ctx.fileExists('src/s21_string.h');
            ctx.assert(exists, 's21_string.h not found');
          },
        },
        {
          name: 'Project compiles to static library',
          timeout: 30000,
          async run(ctx) {
            const result = await ctx.exec('make s21_string.a 2>&1 || make all 2>&1');
            const libExists = await ctx.fileExists('s21_string.a') ||
                              await ctx.fileExists('libs21_string.a');
            ctx.assert(libExists, 'Static library (s21_string.a) not created after make');
          },
        },
        {
          name: 'make clean removes build artifacts',
          async run(ctx) {
            await ctx.exec('make clean');
            const result = await ctx.exec('find . -name "*.o" -not -path "./node_modules/*" | head -5');
            ctx.assertEqual(result.stdout.trim(), '', 'Object files remain after make clean');
          },
        },
        {
          name: 'make test target exists',
          timeout: 60000,
          async run(ctx) {
            const result = await ctx.exec('make test 2>&1 || make check 2>&1');
            // Just check it doesn't crash, actual results may vary
            ctx.assert(result.exitCode === 0 || result.stderr.includes('test'),
              'make test target should exist and run');
          },
        },
      ],
    },

    {
      name: 'Function Declarations',
      tests: [
        ...[
          'memchr', 'memcmp', 'memcpy', 'memset',
          'strncat', 'strchr', 'strncmp', 'strncpy',
          'strcspn', 'strerror', 'strlen', 'strpbrk',
          'strrchr', 'strstr', 'strtok',
        ].map(func => ({
          name: `s21_${func} declared in header`,
          async run(ctx) {
            const headerPath = await ctx.fileExists('s21_string.h') ? 's21_string.h' : 'src/s21_string.h';
            const header = await ctx.readFile(headerPath);
            ctx.assert(
              header.includes(`s21_${func}`),
              `s21_${func} not found in s21_string.h`
            );
          },
        })),
      ],
    },

    {
      name: 'sprintf Functions',
      tests: [
        {
          name: 's21_sprintf declared',
          async run(ctx) {
            const headerPath = await ctx.fileExists('s21_string.h') ? 's21_string.h' : 'src/s21_string.h';
            const header = await ctx.readFile(headerPath);
            ctx.assert(header.includes('s21_sprintf'), 's21_sprintf not found in header');
          },
        },
        {
          name: 's21_sscanf declared (bonus)',
          async run(ctx) {
            const headerPath = await ctx.fileExists('s21_string.h') ? 's21_string.h' : 'src/s21_string.h';
            const header = await ctx.readFile(headerPath);
            // This is a bonus, so just info if missing
            if (!header.includes('s21_sscanf')) {
              console.log(chalk.gray('      ℹ s21_sscanf not found (bonus function)'));
            }
            ctx.assert(true); // Always pass, it's bonus
          },
        },
      ],
    },

    {
      name: 'Special Functions (C#)',
      tests: [
        ...[
          'to_upper', 'to_lower', 'insert', 'trim',
        ].map(func => ({
          name: `s21_${func} declared`,
          async run(ctx) {
            const headerPath = await ctx.fileExists('s21_string.h') ? 's21_string.h' : 'src/s21_string.h';
            const header = await ctx.readFile(headerPath);
            ctx.assert(
              header.includes(`s21_${func}`),
              `s21_${func} not found (required special function)`
            );
          },
        })),
      ],
    },
  ],

  styleChecks: [
    {
      name: 'S21 C Style',
      async check(projectDir) {
        const { STYLE_CHECKERS } = await import('../core/style-check.js');
        return STYLE_CHECKERS.c.check(projectDir);
      },
    },
  ],
};

import chalk from 'chalk';
