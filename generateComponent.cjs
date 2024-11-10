const fs = require("fs");
const path = require("path");

// Set DEPTH and COUNT variables
const DEPTH = 5; // Number of nested levels
const COUNT = 11; // Number of components (e.g., A, B, C, D)

// Helper function to create component files and directory structure
function generateComponent(level, count, currentPath, baseDir) {
  // Define import statements
  const importStatements = Array.from({ length: count })
    .map((_, i) => {
      const componentName = String.fromCharCode(65 + i);
      return level < DEPTH
        ? `import ${componentName} from './${componentName}';`
        : null;
    })
    .filter((v) => v !== null)
    .join("\n");

  // Define component content with recursive child components
  const componentName = `Component${level}`;
  const componentContent = `${importStatements}

const ${componentName} = () => {
  return (
    <div>
      <h1>${componentName}</h1>
      ${
        level < DEPTH
          ? `<>
            ${Array.from({ length: count })
              .map((_, i) => `<${String.fromCharCode(65 + i)} />`)
              .join("\n")}
          </>`
          : `<>leaf</>`
      }
    </div>
  );
};

export default ${componentName};
`;

  // Write index.tsx file in the current path
  const filePath = path.join(currentPath, "index.tsx");
  fs.writeFileSync(filePath, componentContent);

  // If not at the max depth, create subfolders and repeat
  if (level < DEPTH) {
    Array.from({ length: count }).forEach((_, i) => {
      const subComponentName = String.fromCharCode(65 + i);
      const subComponentPath = path.join(currentPath, subComponentName);

      // Create directory for the subcomponent
      fs.mkdirSync(subComponentPath, { recursive: true });

      // Recursively create the next level component
      generateComponent(level + 1, count, subComponentPath, baseDir);
    });
  }
}

// Generate the root index file in the specified base directory
function generateRootIndex(baseDir) {
  const rootImports = Array.from({ length: COUNT })
    .map((_, i) => {
      const componentName = String.fromCharCode(65 + i);
      return `import ${componentName} from './${componentName}';`;
    })
    .join("\n");

  const rootContent = `
${rootImports}

function Index() {
  return (
    <>
      ${Array.from({ length: COUNT })
        .map((_, i) => `<${String.fromCharCode(65 + i)} />`)
        .join("\n")}
    </>
  );
}

export default Index;
`;

  fs.writeFileSync(path.join(baseDir, "index.tsx"), rootContent);
}

// Run the generation functions with a customizable base directory
function generateComponentsStructure(baseDir = ".") {
  // Create base directory if it doesn't exist
  fs.mkdirSync(baseDir, { recursive: true });

  generateRootIndex(baseDir); // Generate the root index file
  generateComponent(1, COUNT, baseDir, baseDir); // Start generating components from level 1
}

// Example usage: specify the base directory where components should be generated
generateComponentsStructure("./src/components"); // Change the path as needed
