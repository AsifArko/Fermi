#!/usr/bin/env node

const fs = require('fs');

// Test on a specific file
const filePath =
  'src/sanity/components/analytics-dashboard/InstructorAnalyticsDashboard.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('File:', filePath);
console.log('Total lines:', lines.length);

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
    console.log(`Import at line ${currentLine}:`, line);
  } else if (inImports && line === '') {
    // Empty line after imports - continue collecting
    currentLine++;
    continue;
  } else if (
    inImports &&
    !line.startsWith('//') &&
    !line.startsWith('/*') &&
    line !== '' &&
    line !== "'use client';"
  ) {
    // Non-comment, non-import, non-empty line, not 'use client'
    break;
  }
  currentLine++;
}

console.log('\nImport section found:');
console.log('Start line:', importStart);
console.log('Number of imports:', importLines.length);

console.log('\nDEBUG: importLines array content:');
importLines.forEach((line, i) => {
  console.log(`  importLines[${i}] = line ${line.index}: "${line.line}"`);
});

// Parse imports
const imports = importLines.map(({ line, index }) => {
  const match = line.match(/import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/);
  const result = {
    fullLine: line,
    path: match ? match[1] : '',
    index,
  };
  console.log(`Parsing line ${index}: "${line}" -> path: "${result.path}"`);
  return result;
});

console.log('\nParsed imports:');
imports.forEach(imp => {
  console.log(`- ${imp.path} (line ${imp.index})`);
});

// Check current order vs expected order
console.log('\nCurrent import order:');
imports.forEach((imp, i) => {
  console.log(`${i + 1}. ${imp.path}`);
});

// Test the sorting logic
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

const sortedImports = imports.sort((a, b) => {
  const priorityA = getImportPriority(a.path);
  const priorityB = getImportPriority(b.path);

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  // Within same priority group, sort alphabetically
  return a.path.localeCompare(b.path);
});

console.log('\nExpected import order after sorting:');
sortedImports.forEach((imp, i) => {
  console.log(
    `${i + 1}. ${imp.path} (priority: ${getImportPriority(imp.path)})`
  );
});

console.log('\nDEBUG: imports array content:');
imports.forEach((imp, i) => {
  console.log(`  imports[${i}] = "${imp.path}"`);
});

console.log('\nDEBUG: sortedImports array content:');
sortedImports.forEach((imp, i) => {
  console.log(`  sortedImports[${i}] = "${imp.path}"`);
});

// Check if reordering is needed
let needsReordering = false;
console.log('\nDetailed comparison:');
for (let i = 0; i < imports.length; i++) {
  console.log(
    `Position ${i}: current="${imports[i].path}" vs expected="${sortedImports[i].path}"`
  );
  if (imports[i].path !== sortedImports[i].path) {
    needsReordering = true;
    console.log(`  -> MISMATCH DETECTED!`);
  }
}

console.log('\nNeeds reordering:', needsReordering);
