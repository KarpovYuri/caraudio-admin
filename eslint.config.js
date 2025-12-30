// @ts-check
const { defineConfig } = require('eslint/config');
const tsEslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = defineConfig([
	{
		files: ['**/*.ts'],
		extends: [
			tsEslint.configs.recommended,
			tsEslint.configs.stylistic,
			angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'app',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'app',
					style: 'kebab-case',
				},
			],
		},
	},
	{
		files: ['**/*.html'],
		extends: [
			angular.configs.templateRecommended,
			angular.configs.templateAccessibility,
		],
		rules: {},
	},
	prettierConfig,
	{
		files: ['**/*.{js,ts,html,scss}'],
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			'prettier/prettier': 'error',
		},
	},
]);
