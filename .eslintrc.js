module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parser: 'babel-eslint'
  // parserOptions: {
  // }
}
