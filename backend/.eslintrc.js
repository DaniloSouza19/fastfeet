module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base', 'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error", // informar como erro quando não estabelecer os requisitos do prettier
    "class-methods-use-this": "off", //obrigava a usar this nos metodos da class
    "no-param-reassign": "off",//deixa receber um parametro e fazer alterações 
    //nele. (ex: sequelize usa)
    "camelcase": "off", //não obriga a usar camelcase (tabelas no sequelize etc)
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]// não poderia usar variaveis sem uso
  },
};
