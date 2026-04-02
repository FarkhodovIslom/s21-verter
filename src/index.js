// S21 Verter - Public API
export { runTests, TestContext, TestError } from './core/runner.js';
export { runStyleCheck, STYLE_CHECKERS } from './core/style-check.js';
export { loadTestModule, validateModule, listAvailableModules } from './core/loader.js';
export { PROJECTS, CATEGORIES, getProject, getProjectsByCategory, searchProjects } from './projects/registry.js';
export { detectProject, detectLanguage } from './projects/detector.js';
