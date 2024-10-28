module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parserOptions: { ecmaVersion: "latest", sourceType: "module" },
	settings: { react: { version: "18.2" } },
	plugins: ["react-refresh"],
	rules: {
		"no-unescaped-entities": "off",
		"no-unused-vars": "off",
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },
		],
		"react/no-unused-vars": "off",
		"react/no-unescaped-entities": "off",
		"react/prop-types": "off",
		"react/no-unescaped-entities": "off",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
	},
};
