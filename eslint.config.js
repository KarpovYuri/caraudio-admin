import globals from 'globals'
import pluginJs from '@eslint/js'
import tsESLint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import vueParser from 'vue-eslint-parser'
import pluginESLintComments from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import'

export default [
	pluginJs.configs.recommended,
	...tsESLint.configs.recommended,
	...pluginVue.configs['flat/recommended'],
	eslintConfigPrettier,
	{
		plugins: {
			'typescript-eslint': tsESLint.plugin,
			'eslint-comments': pluginESLintComments,
			vue: pluginVue,
			prettier: prettierPlugin,
			import: importPlugin.flatConfigs.recommended,
		},
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, ...globals.es2020 },
		},
	},
	{
		files: ['**/*.{js,ts,jsx,tsx,vue}'],
		languageOptions: {
			sourceType: 'module',
			parserOptions: {
				warnOnUnsupportedTypeScriptVersion: false,
			},
		},
	},
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsESLint.parser,
		},
	},
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsESLint.parser,
			},
		},
	},
	{
		ignores: ['node_modules', 'public', 'build', 'dist'],
	},
]
