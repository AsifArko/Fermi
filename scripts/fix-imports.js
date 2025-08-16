#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Import order rules based on actual ESLint expectations
const IMPORT_ORDER = {
  '@sanity': 1,
  '@radix-ui': 2,
  '@clerk': 3,
  '@stripe': 4,
  next: 5,
  react: 6,
  'lucide-react': 7,
  'framer-motion': 8,
  zustand: 9,
  zod: 10,
  'date-fns': 11,
  clsx: 12,
  'tailwind-merge': 13,
  '@': 14, // Internal imports
  './': 15, // Relative imports
  '../': 16, // Relative imports
};

function getImportPriority(importPath) {
  for (const [pattern, priority] of Object.entries(IMPORT_ORDER)) {
    if (importPath.startsWith(pattern)) {
      return priority;
    }
  }
  return 999; // Default priority for other imports
}

function sortImports(imports) {
  return imports.sort((a, b) => {
    const priorityA = getImportPriority(a.path);
    const priorityB = getImportPriority(b.path);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Within same priority group, sort alphabetically
    return a.path.localeCompare(b.path);
  });
}

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let inImports = false;
  let importStart = -1;
  const importLines = [];
  let currentLine = 0;

  // Find import section
  while (currentLine < lines.length) {
    const line = lines[currentLine].trim();

    if (line.startsWith('import ') || line.startsWith('import ')) {
      if (!inImports) {
        inImports = true;
        importStart = currentLine;
      }
      importLines.push({ line: lines[currentLine], index: currentLine });
    } else if (inImports && line === '') {
      // Empty line after imports - continue collecting
      currentLine++;
      continue;
    } else if (
      inImports &&
      !line.startsWith('//') &&
      !line.startsWith('/*') &&
      line !== ''
    ) {
      // Non-comment, non-import, non-empty line
      break;
    }
    currentLine++;
  }

  if (importStart === -1) return false; // No imports found

  // Parse imports
  const imports = importLines.map(({ line, index }) => {
    const match = line.match(/import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/);
    return {
      fullLine: line,
      path: match ? match[1] : '',
      index,
    };
  });

  // Sort imports
  const sortedImports = sortImports(imports);

  // Check if reordering is needed
  let needsReordering = false;
  for (let i = 0; i < imports.length; i++) {
    if (imports[i].path !== sortedImports[i].path) {
      needsReordering = true;
      break;
    }
  }

  if (!needsReordering) return false;

  // Rebuild file with sorted imports and proper spacing
  const newLines = [...lines];
  const sortedLines = sortedImports.map(imp => imp.fullLine);

  // Add empty lines between import groups
  let currentPriority = -1;
  const finalLines = [];

  for (const line of sortedLines) {
    const match = line.match(/import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/);
    if (match) {
      const priority = getImportPriority(match[1]);
      if (currentPriority !== -1 && currentPriority !== priority) {
        finalLines.push(''); // Add empty line between groups
      }
      currentPriority = priority;
    }
    finalLines.push(line);
  }

  // Replace the import section
  newLines.splice(importStart, sortedLines.length, ...finalLines);

  // Write back to file
  fs.writeFileSync(filePath, newLines.join('\n'));
  return true;
}

// Main execution
const srcFiles = glob.sync('src/**/*.{ts,tsx}');
let fixedCount = 0;

console.log('Fixing import order in', srcFiles.length, 'files...');

for (const file of srcFiles) {
  if (fixFile(file)) {
    fixedCount++;
    console.log('Fixed:', file);
  }
}

console.log(`\nFixed ${fixedCount} files.`);
console.log('Run "npm run lint" to verify all issues are resolved.');
