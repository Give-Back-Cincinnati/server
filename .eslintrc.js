module.exports = {
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-console": process.env.NODE_ENV === 'production' ? 'error' : 'warn'
  }
}
