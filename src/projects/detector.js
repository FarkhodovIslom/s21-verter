import { readdir, readFile, stat } from 'fs/promises';
import { join, basename } from 'path';
import { PROJECTS } from './registry.js';

/**
 * Heuristics to detect which S21 project is in the given directory
 */
export async function detectProject(dir = '.') {
  const resolvedDir = dir;
  
  try {
    const files = await readdir(resolvedDir);
    const dirName = basename(resolvedDir === '.' ? process.cwd() : resolvedDir).toLowerCase();
    
    // Strategy 1: Match directory name against known project names
    for (const project of PROJECTS) {
      const projectNameNorm = project.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dirNorm = dirName.replace(/[^a-z0-9]/g, '');
      if (dirNorm.includes(projectNameNorm) || projectNameNorm.includes(dirNorm)) {
        return project;
      }
    }

    // Strategy 2: Match by ID patterns in directory name
    for (const project of PROJECTS) {
      const idParts = project.id.split('-');
      if (idParts.some(part => dirName.includes(part) && part.length > 2)) {
        return project;
      }
    }

    // Strategy 3: Analyze file contents
    const hasFile = (name) => files.some(f => f.toLowerCase() === name.toLowerCase());
    const hasMakefile = hasFile('Makefile') || hasFile('makefile');
    const hasCMake = hasFile('CMakeLists.txt');
    const hasPackageJson = hasFile('package.json');
    const hasPyProject = hasFile('pyproject.toml') || hasFile('setup.py') || hasFile('requirements.txt');
    const hasGoMod = hasFile('go.mod');
    const hasDockerfile = hasFile('Dockerfile') || hasFile('docker-compose.yml');
    const hasCsproj = files.some(f => f.endsWith('.csproj'));

    // Check for C files with Makefile (likely C project)
    const cFiles = files.filter(f => f.endsWith('.c') || f.endsWith('.h'));
    const cppFiles = files.filter(f => f.endsWith('.cpp') || f.endsWith('.hpp'));

    // Strategy 4: Check for S21 naming patterns in files
    for (const file of files) {
      if (file.includes('s21_')) {
        // It's a C/C++ School 21 project
        if (file.includes('matrix')) return PROJECTS.find(p => p.id === 'c-s21-matrix');
        if (file.includes('decimal')) return PROJECTS.find(p => p.id === 'c-s21-decimal');
        if (file.includes('string')) return PROJECTS.find(p => p.id === 'c-s21-stringplus');
      }
      if (file.includes('cat') || file.includes('grep')) {
        if (cFiles.length > 0) return PROJECTS.find(p => p.id === 'c-simplebashutils');
      }
    }

    // Strategy 5: Language-based best guess (broad category)
    if (cFiles.length > 0 && hasMakefile) {
      return { id: 'unknown-c', name: 'C Project (unknown)', category: 'C', language: 'c', description: 'Detected C project' };
    }
    if (cppFiles.length > 0) {
      return { id: 'unknown-cpp', name: 'C++ Project (unknown)', category: 'CPP', language: 'cpp', description: 'Detected C++ project' };
    }
    if (hasDockerfile) {
      return { id: 'unknown-devops', name: 'DevOps Project (unknown)', category: 'DEVOPS', language: 'docker', description: 'Detected DevOps project' };
    }
    if (hasPyProject) {
      return { id: 'unknown-python', name: 'Python Project (unknown)', category: 'PYTHON', language: 'python', description: 'Detected Python project' };
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Get the language of a project directory
 */
export async function detectLanguage(dir = '.') {
  try {
    const files = await readdir(dir);
    const extensions = files.map(f => f.split('.').pop().toLowerCase());
    
    const langMap = {
      c: 'c', h: 'c',
      cpp: 'cpp', hpp: 'cpp', cc: 'cpp',
      py: 'python',
      js: 'javascript', jsx: 'javascript', ts: 'javascript', tsx: 'javascript',
      java: 'java',
      go: 'go',
      cs: 'csharp',
      kt: 'kotlin',
      swift: 'swift',
      sql: 'sql',
      sh: 'bash',
    };

    const langCounts = {};
    for (const ext of extensions) {
      const lang = langMap[ext];
      if (lang) {
        langCounts[lang] = (langCounts[lang] || 0) + 1;
      }
    }

    const sorted = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  } catch {
    return null;
  }
}
