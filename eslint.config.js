import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: ["react-hooks"], // react-hooks 플러그인만 사용
    rules: {
      ...reactHooks.configs.recommended.rules, // React Hooks 규칙
    },
  },
];
