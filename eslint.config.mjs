import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^(skip|target|prop)$|^_",
        "ignoreRestSiblings": true,
        "destructuredArrayIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-require-imports": ["warn", {
        "allow": ["lib/generated/**/*"]
      }]
    },
    ignores: [
      "lib/generated/**/*",
      "**/node_modules/**",
      ".next/**",
      "dist/**",
      "*.config.*"
    ]
  }
];

export default eslintConfig;