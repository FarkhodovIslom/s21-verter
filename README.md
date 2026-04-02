# 🔥 S21 Verter

**Custom auto-tester for School 21 projects.**  
Test your code before submission. Don't embarrass yourself at review.

```
███████╗██████╗  ██╗    ██╗   ██╗███████╗██████╗ ████████╗███████╗██████╗
██╔════╝╚════██╗███║    ██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
███████╗ █████╔╝╚██║    ██║   ██║█████╗  ██████╔╝   ██║   █████╗  ██████╔╝
╚════██║██╔═══╝  ██║    ╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝  ██╔══██╗
███████║███████╗ ██║     ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██║  ██║
╚══════╝╚══════╝ ╚═╝      ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

## Installation

```bash
# Global install (recommended)
npm install -g s21-verter

# Or run directly with npx
npx s21-verter

# Or clone and link
git clone https://github.com/hanzo-dev/s21-verter.git
cd s21-verter
npm link
```

## Usage

### Interactive Mode (recommended)
```bash
# Just run it - beautiful TUI with project selection
verter
```

### Direct Run
```bash
# Run tests for a specific project
verter run c-simplebashutils

# Run in a specific directory
verter run c-s21-stringplus --dir ~/school21/C3_s21_stringplus

# Skip style checks
verter run c-simplebashutils --no-style

# Verbose output
verter run c-simplebashutils -v
```

### Style Check Only
```bash
verter style c-simplebashutils
verter style --dir ~/school21/my_project
```

### List Projects
```bash
# List all projects
verter list

# Filter by category
verter list -c C
verter list -c DEVOPS
verter list -c ML
```

### Project Info
```bash
verter info c-simplebashutils
```

## Architecture

```
s21-verter/
├── bin/verter.js           # CLI entry point
├── src/
│   ├── core/
│   │   ├── runner.js       # Test execution engine
│   │   ├── loader.js       # Test module discovery & loading
│   │   ├── style-check.js  # Built-in style checkers (C, C++, Python, JS, etc.)
│   │   └── interactive.js  # Interactive TUI mode
│   ├── ui/
│   │   └── ascii.js        # ASCII art, banners, progress bars
│   ├── projects/
│   │   ├── registry.js     # Full S21 project database (120+ projects)
│   │   └── detector.js     # Auto-detect project from directory
│   └── tests/
│       ├── _template.js    # Template for creating new test modules
│       ├── c-simplebashutils.js  # Example: cat & grep tests
│       └── c-s21-stringplus.js   # Example: string.h tests
└── package.json
```

## Creating Test Modules

Test modules are the heart of Verter. Each module tests a specific S21 project.

### Where to put test modules

Test modules are loaded from these paths (in order):
1. `src/tests/` — Built-in tests (in this repo)
2. `.verter/tests/` — Project-local tests (in your project directory)
3. `~/.verter/tests/` — User-global tests (in your home directory)

### Quick Start

```bash
# Copy the template
cp src/tests/_template.js ~/.verter/tests/my-project-id.js

# Edit and customize
code ~/.verter/tests/my-project-id.js
```

### Test Module API

```javascript
export default {
  id: 'project-id',        // Must match registry ID
  name: 'My Tests',
  version: '1.0.0',
  language: 'c',

  async setup(projectDir) { /* compile, prepare */ },

  suites: [
    {
      name: 'Suite Name',
      tests: [
        {
          name: 'Test name',
          timeout: 10000,    // optional, default 10s
          async run(ctx) {
            // Test context API:
            ctx.assert(condition, message)
            ctx.assertEqual(actual, expected, message)
            ctx.assertMatch(string, regex, message)
            ctx.assertTruthy(value, message)
            await ctx.assertFileExists(path, message)

            // Execute shell commands
            const result = await ctx.exec('make test');
            // result.stdout, result.stderr, result.exitCode

            // File operations
            const content = await ctx.readFile('file.c');
            const exists = await ctx.fileExists('file.c');
            await ctx.writeTempFile('test.txt', 'content');
          },
        },
      ],
    },
  ],

  styleChecks: [
    {
      name: 'Check Name',
      async check(projectDir) {
        return [
          { file: 'main.c', line: 42, message: 'Issue', severity: 'error' }
        ];
      },
    },
  ],

  async teardown(projectDir) { /* cleanup */ },
};
```

## Supported Projects

120+ School 21 projects across all tracks:

| Category | Projects | Language |
|----------|----------|----------|
| 🔧 C | SimpleBashUtils, s21_stringplus, s21_decimal, s21_matrix | C |
| ⚙️ C++ | Containers, SmartCalc, 3DViewer, MLP, Parallels | C++ |
| 🧮 Algorithms | Maze, SimpleNavigator (JS/Java/Python/Go/C#/Kotlin/Swift) | Multiple |
| 📊 Data Science | Tweets, Churn, Spotify, Amazon, etc. | Python |
| 🤖 Machine Learning | Supervised, Neural Networks, CNN, RNN, Attention | Python |
| 🐳 DevOps | Linux, Docker, CI/CD, Docker Compose | Bash/Docker |
| 🐍 Python | Bootcamp, Backend | Python |
| 🔐 Cybersecurity | Networking, Crypto, Threat Detection | Mixed |
| 🧬 Bioinformatics | PlasmidGC, HIBScan, GenomeMatch | Python |
| 🧪 QA | Foundation, Web Testing, Mobile Testing, AQA | Mixed |
| 📋 BSA | Requirements, BPMN, REST, SOAP | Text |
| 📌 Project Mgmt | Lifecycle, Risk Management, Planning | Text |
| 🎨 UX/UI | Design, Prototyping, Portfolio | Figma |

Run `verter list` for the full list with IDs.

## Built-in Style Checkers

- **C** — S21 Norm (line length, functions per file, headers, trailing whitespace)
- **C++** — Google/S21 style (no `using namespace std`, line length)
- **Python** — PEP8 basics (line length, mixed indentation)
- **JavaScript** — ESLint-like (var usage, console.log, line length)
- **Bash** — ShellCheck basics (shebang, line length)
- **SQL** — Basic formatting (SELECT * warnings)
- **Docker** — Hadolint basics (`:latest` warnings, FROM check)

## Adding Tests with AI

The modular architecture is designed for AI-assisted test generation. Use Claude Code or Cursor:

```
"Create a test module for S21 project c-s21-matrix.
The project implements a matrix library in C with functions:
s21_create_matrix, s21_remove_matrix, s21_eq_matrix,
s21_sum_matrix, s21_sub_matrix, s21_mult_number,
s21_mult_matrix, s21_transpose, s21_determinant,
s21_calc_complements, s21_inverse_matrix.
Follow the test module format from s21-verter."
```

## License

MIT — by Hanzo Dev
