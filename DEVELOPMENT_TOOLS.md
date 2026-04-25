# Development Tools Guide

This document describes the enhanced development tools and code quality measures implemented in the Fermi project.

## Available Scripts

### Code Quality

- `npm run lint` - Run ESLint to check for code quality issues
- `npm run lint:fix` - Automatically fix ESLint issues where possible
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check if code is properly formatted
- `npm run type-check` - Run TypeScript compiler to check types

### Testing

- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Additional Tools

- `npm run spell-check` - Check spelling across all files
- `npm run markdown-lint` - Lint markdown files

## Pre-commit Hooks

The project uses Husky and lint-staged to automatically run code quality checks before each commit:

- **ESLint**: Checks for code quality issues
- **Prettier**: Ensures consistent formatting
- **TypeScript**: Validates type safety
- **Spell Check**: Catches spelling errors

## Configuration Files

### ESLint (eslint.config.mjs)

Comprehensive linting rules including:

- Import ordering and organization
- React best practices
- TypeScript strict rules
- General code quality improvements

### Prettier (.prettierrc)

Strict formatting rules for consistent code style:

- 80 character line width
- Single quotes
- Trailing commas
- Consistent spacing

### TypeScript (tsconfig.json)

Enhanced strict mode with:

- Unused variable detection
- Strict parameter checking
- Exact optional property types
- Implicit return checking

### Jest (jest.config.js)

Testing configuration with:

- Next.js integration
- TypeScript support
- Coverage reporting
- Module path mapping

## Code Quality Standards

### Import Organization

Imports are automatically organized in the following order:

1. Built-in modules
2. External dependencies
3. Internal modules
4. Parent directories
5. Sibling files
6. Index files

### React Best Practices

- JSX keys for list items
- No duplicate props
- No undefined JSX elements
- No array index keys
- Proper entity escaping

### TypeScript Rules

- No unused variables
- Explicit return types (warnings)
- No explicit `any` types
- Prefer `const` over `let`

## Troubleshooting

### Common Issues

1. **ESLint Errors**: Run `npm run lint:fix` to auto-fix issues
2. **Formatting Issues**: Run `npm run format` to format all files
3. **Type Errors**: Run `npm run type-check` to see TypeScript issues
4. **Pre-commit Failures**: Fix all linting issues before committing

### Disabling Rules (When Necessary)

If you need to disable a specific rule for a particular case:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = getData();
```

## Best Practices

1. **Always run tests before committing**
2. **Fix linting issues immediately**
3. **Use TypeScript strict mode features**
4. **Follow the established import order**
5. **Keep code formatted with Prettier**

## IDE Integration

### VS Code Extensions

- ESLint
- Prettier
- TypeScript Importer
- Jest Runner

### Settings

Enable "Format on Save" and "Fix on Save" for the best development experience.
