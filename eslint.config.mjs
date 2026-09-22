import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylistic from "@stylistic/eslint-plugin";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    plugins: { "@stylistic": stylistic },
    // Formatage uniquement : en "warn" pour ne pas afficher d'erreurs rouges,
    // ces règles sont corrigées automatiquement à la sauvegarde.
    rules: {
      "@stylistic/indent": ["warn", 2],
      "@stylistic/jsx-indent-props": ["warn", 2],
      "@stylistic/jsx-closing-bracket-location": ["warn", "line-aligned"],
      "@stylistic/quotes": ["warn", "double", { avoidEscape: true }],
      "@stylistic/semi": ["warn", "always"],
      "@stylistic/comma-dangle": ["warn", "always-multiline"],
      "@stylistic/object-curly-spacing": ["warn", "always"],
      "@stylistic/arrow-spacing": "warn",
      "@stylistic/space-infix-ops": "warn",
      "@stylistic/keyword-spacing": "warn",
      "@stylistic/no-multiple-empty-lines": ["warn", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "@stylistic/eol-last": ["warn", "always"],
      "@stylistic/no-trailing-spaces": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
