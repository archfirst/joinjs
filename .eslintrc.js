module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        mocha: true
    },
    globals: {
        expect: true
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
        },
        sourceType: 'module'
    },
    extends: [
        'eslint:recommended'
    ],
    rules: {
        'arrow-spacing': 'error',
        'block-spacing': 'error',
        'comma-dangle': 'off',
        'comma-spacing': 'error',
        'comma-style': 'error',
        'curly': 'error',
        'dot-notation': 'error',
        'eqeqeq': 'error',
        'eol-last': 'error',
        'indent': ['error', 4, {SwitchCase: 1}],
        'key-spacing': 'error',
        'keyword-spacing': 'error',
        'linebreak-style': ['error', 'unix'],
        'no-console': 'off',
        'no-param-reassign': 'error',
        'no-tabs': 'error',
        'no-trailing-spaces': 'error',
        'no-underscore-dangle': 'error',
        'no-whitespace-before-property': 'error',
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'semi-spacing': 'error',
        'space-before-blocks': 'error',
        'space-before-function-paren': ['error', 'never'],
        'space-in-parens': 'error',

        'react/display-name': 'off',
        'react/prop-types': 'off'
    }
};
