import { readdir, stat, access } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Test Module Interface
 * 
 * Each test module should export:
 * {
 *   id: string,           // Matches project ID from registry
 *   name: string,         // Human readable name
 *   version: string,      // Module version
 *   language: string,     // Target language
 *   
 *   // Called before tests run
 *   setup?: async (projectDir) => void,
 *   
 *   // Called after tests complete
 *   teardown?: async (projectDir) => void,
 *   
 *   // The actual test suites
 *   suites: [
 *     {
 *       name: string,        // Suite name (e.g., "Compilation", "Functionality")
 *       tests: [
 *         {
 *           name: string,      // Test name
 *           run: async (ctx) => TestResult,  // Test function
 *           timeout?: number,  // Timeout in ms
 *         }
 *       ]
 *     }
 *   ],
 *   
 *   // Style checks specific to this project
 *   styleChecks?: [
 *     {
 *       name: string,
 *       check: async (projectDir) => StyleIssue[],
 *     }
 *   ]
 * }
 */

/**
 * Search paths for test modules
 */
function getModulePaths() {
  const baseDir = resolve(__dirname, '..');
  return [
    join(baseDir, 'tests'),                    // Built-in tests
    join(process.cwd(), '.verter', 'tests'),   // Project-local tests
    join(process.env.HOME || '~', '.verter', 'tests'), // User-global tests
  ];
}

/**
 * Load a specific test module by project ID
 */
export async function loadTestModule(projectId) {
  const paths = getModulePaths();
  
  for (const basePath of paths) {
    try {
      // Try direct file: {basePath}/{projectId}.js
      const directPath = join(basePath, `${projectId}.js`);
      try {
        await access(directPath);
        const module = await import(pathToFileURL(directPath).href);
        return module.default || module;
      } catch {}

      // Try directory: {basePath}/{projectId}/index.js
      const dirPath = join(basePath, projectId, 'index.js');
      try {
        await access(dirPath);
        const module = await import(pathToFileURL(dirPath).href);
        return module.default || module;
      } catch {}

      // Try by category subdirectory: {basePath}/{category}/{projectId}.js
      const entries = await readdir(basePath, { withFileTypes: true }).catch(() => []);
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const catPath = join(basePath, entry.name, `${projectId}.js`);
          try {
            await access(catPath);
            const module = await import(pathToFileURL(catPath).href);
            return module.default || module;
          } catch {}
        }
      }
    } catch {}
  }

  return null;
}

/**
 * List all available test modules
 */
export async function listAvailableModules() {
  const paths = getModulePaths();
  const modules = [];

  for (const basePath of paths) {
    try {
      const entries = await readdir(basePath, { recursive: true });
      for (const entry of entries) {
        if (entry.endsWith('.js') || entry.endsWith('index.js')) {
          try {
            const fullPath = join(basePath, entry);
            const module = await import(pathToFileURL(fullPath).href);
            const mod = module.default || module;
            if (mod && mod.id) {
              modules.push({
                id: mod.id,
                name: mod.name,
                version: mod.version,
                path: fullPath,
                source: basePath,
              });
            }
          } catch {}
        }
      }
    } catch {}
  }

  return modules;
}

/**
 * Validate a test module structure
 */
export function validateModule(module) {
  const errors = [];
  
  if (!module.id) errors.push('Missing "id" field');
  if (!module.name) errors.push('Missing "name" field');
  if (!module.suites || !Array.isArray(module.suites)) errors.push('Missing or invalid "suites" array');
  
  if (module.suites) {
    for (const suite of module.suites) {
      if (!suite.name) errors.push(`Suite missing "name"`);
      if (!suite.tests || !Array.isArray(suite.tests)) {
        errors.push(`Suite "${suite.name}" missing "tests" array`);
      } else {
        for (const test of suite.tests) {
          if (!test.name) errors.push(`Test in "${suite.name}" missing "name"`);
          if (!test.run || typeof test.run !== 'function') {
            errors.push(`Test "${test.name}" in "${suite.name}" missing "run" function`);
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
