module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "node_modules"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],

  rules: {
    "prettier/prettier": ["error", { singleQuote: false, semi: true }],
    indent: ["error", 2, { SwitchCase: 1 }],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    eqeqeq: "error",
    "linebreak-style": ["error", "unix"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "max-len": [
      "error",
      {
        code: 80,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "object-curly-spacing": ["error", "always"],
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
    "no-trailing-spaces": "error",
    "no-console": "off",
    "no-unused-vars": [
      "off",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
      },
    ],
    "no-unescaped-entities": "off",
    "react/no-unused-vars": "off",
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
