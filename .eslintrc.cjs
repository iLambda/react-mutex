module.exports = {
    env: { browser: true, es2021: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: { 
        ecmaVersion: 'latest', 
        ecmaFeatures: {
            jsx: true
        },
        project: './tsconfig.json',
        sourceType: 'module' 
    },
    ignorePatterns: ['.eslintrc.cjs', 'dist/**'],
    plugins: ['react', 'react-hooks', 'unused-imports', 'eslint-plugin-tsdoc'],
    rules: {
        'linebreak-style': ['error', 'unix'],
        'react/button-has-type': 'error',
        'react/display-name': 'off',
        'react/hook-use-state': ['error', { 'allowDestructuredState': true }],
        'react/jsx-uses-react': 'off',
        'react/jsx-equals-spacing': 'error',
        'react/prefer-stateless-function': 'error',
        'react/react-in-jsx-scope': 'off',
        'no-extra-semi': 'error',
        'tsdoc/syntax': 'warn',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/consistent-type-exports': ['error'],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
        ],
        '@typescript-eslint/no-empty-interface': [
            'error',
            {
                'allowSingleExtends': true
            }
        ],
        'quotes': [
            'error', 'single', {
                avoidEscape: true,
                allowTemplateLiterals: true
            }
        ],
        'semi': ['warn', 'always']
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};