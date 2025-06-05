import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore Prisma generated files and other common files
  {
    ignores: [
      "src/generated/**/*",
      "**/generated/**/*", 
      "node_modules/**/*",
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*"
    ]
  },
  // Extend your existing Next.js config
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;