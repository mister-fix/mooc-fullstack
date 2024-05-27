import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin-js";

export default [
	{ ignores: ["node_modules/**", "dist/**"] },
	{
		files: ["**/*.js"],
		languageOptions: {
			sourceType: "commonjs",
			globals: {
				...globals.browser,
			},
			ecmaVersion: "latest",
		},
		plugins: {
			"@stylistic/js": stylisticJs,
		},
		rules: {
			"@stylistic/js/indent": ["error", 2],
			"@stylistic/js/linebreak-style": ["error", "unix"],
			"@stylistic/js/quotes": ["error", "single"],
			"@stylistic/js/semi": ["error", "never"],
			eqeqeq: "error",
			"no-trailing-spaces": "error",
			"object-curly-spacing": ["error", "always"],
			"arrow-spacing": [
				"error",
				{
					before: true,
					after: true,
				},
			],
			"no-console": 0,
		},
	},
	{
		files: ["eslint.config.{js,cjs,mjs}"],
		languageOptions: {
			sourceType: "script",
			globals: {
				...globals.node,
			},
			ecmaVersion: "latest",
		},
		rules: {
			// Specific rules for .eslintrc files
		},
	},
];
