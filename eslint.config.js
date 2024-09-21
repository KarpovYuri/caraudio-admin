import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
	{ files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,vue}'] },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs['flat/essential'],
	eslintConfigPrettier,
	{
		files: ['**/*.vue'],
		languageOptions: { parserOptions: { parser: tseslint.parser } },
	},
	{
		ignores: [
			'node_modules',
			'public',
			'eslintrc.config.js',
			'build',
			'dist',
			'package*.json',
			'*.d.ts',
		],
	},
]
