const fs = require("fs");
const path = require("path");

// take module name from command line args
const moduleName = process.argv[2];

if (!moduleName) {
  console.error(
    "❌ Please provide a module name. Example: node generate-structure order"
  );
  process.exit(1);
}

const basePath = path.join(__dirname, "src", "modules", moduleName);
if (fs.existsSync(basePath)) {
  console.error(`❌ Module "${moduleName}" already exists!`);
  process.exit(1);
}

// files to generate
const files = [
  "controller.ts",
  "route.ts",
  "schema.ts",
  "type.ts",
  "service.ts",
  "validator.ts",
];

fs.mkdirSync(basePath, { recursive: true });
files.forEach((file) => {
  const fileName = `${moduleName}.${file}`;
  const filePath = path.join(basePath, fileName);
  fs.writeFileSync(filePath, `// ${fileName} for ${moduleName} module\n`);
});
console.log(`✅ Module "${moduleName}" structure created successfully!`);
