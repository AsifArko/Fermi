# Phase 3: Enhanced Tooling & Code Quality

## Objectives

- Implement comprehensive ESLint configuration
- Set up Prettier with strict formatting rules
- Add pre-commit hooks and lint-staged
- Implement TypeScript strict mode
- Add code quality tools and automation

## Current Tooling State

### 1. ESLint Configuration

**Current**: Basic Next.js + TypeScript config
**Target**: Comprehensive rules with custom configurations

### 2. Prettier Configuration

**Current**: Basic formatting rules
**Target**: Strict formatting with project-specific rules

### 3. Pre-commit Hooks

**Current**: Basic Husky + lint-staged setup
**Target**: Comprehensive pre-commit validation

## Implementation Plan

### Step 1: Enhanced ESLint Configuration

#### A. Install Additional ESLint Plugins

```bash
npm install -D eslint-plugin-import
npm install -D eslint-plugin-jsx-a11y
npm install -D eslint-plugin-react
npm install -D eslint-plugin-react-hooks
npm install -D eslint-plugin-unicorn
npm install -D eslint-plugin-sonarjs
npm install -D @typescript-eslint/eslint-plugin
npm install -D @typescript-eslint/parser
```

#### B. Create Comprehensive ESLint Config

```javascript
// eslint.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'import/no-unused-modules': 'error',
      'import/no-duplicates': 'error',

      // React rules
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-array-index-key': 'error',
      'react/no-unescaped-entities': 'error',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-const': 'error',

      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
```

### Step 2: Enhanced Prettier Configuration

#### A. Update Prettier Rules

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "embeddedLanguageFormatting": "auto"
}
```

#### B. Add Prettier Ignore Patterns

```gitignore
# .prettierignore
.next/
node_modules/
dist/
build/
coverage/
*.min.js
*.min.css
```

### Step 3: Enhanced Pre-commit Hooks

#### A. Update Husky Configuration

```json
{
  "scripts": {
    "prepare": "husky",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### B. Enhanced Lint-staged Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "git add"],
    "*.{json,md,css,scss}": ["prettier --write", "git add"],
    "*.{ts,tsx}": ["tsc --noEmit"]
  }
}
```

### Step 4: TypeScript Strict Mode

#### A. Update tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 5: Additional Code Quality Tools

#### A. Install Development Tools

```bash
npm install -D jest
npm install -D @testing-library/react
npm install -D @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D jest-environment-jsdom
npm install -D @types/jest
npm install -D cspell
npm install -D markdownlint-cli
```

#### B. Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

#### C. Spell Checker Configuration

```json
// cspell.json
{
  "version": "0.2",
  "language": "en",
  "words": [
    "fermi",
    "sanity",
    "clerk",
    "stripe",
    "groq",
    "tailwindcss",
    "radix",
    "framer",
    "zustand",
    "sonner"
  ],
  "ignorePaths": [
    "node_modules/**",
    ".next/**",
    "dist/**",
    "build/**",
    "coverage/**"
  ]
}
```

## Expected Outcomes

- **Code Quality**: Consistent formatting and linting
- **Developer Experience**: Automated code quality checks
- **Bug Prevention**: Catch issues before commit
- **Team Consistency**: Uniform code style across team
- **Performance**: Faster development with better tooling

## Success Criteria

- [ ] ESLint catches all code quality issues
- [ ] Prettier formats all code consistently
- [ ] Pre-commit hooks prevent bad commits
- [ ] TypeScript strict mode enabled
- [ ] Test coverage established
- [ ] Spell checking implemented
- [ ] All existing code passes new rules
