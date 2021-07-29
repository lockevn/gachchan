module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    browser: true,
    es6: true
  },
  extends: ["eslint:recommended"],
  parser: 'babel-eslint',
  parserOptions: {
    parser: "babel-eslint",
    "sourceType": "module"
  },
  // browserslist: ["> 1%", "last 2 versions", "not dead"],
  
  rules: {
    "no-undef": "warn",
    "no-unexpected-multiline": "warn",

    "no-console": "off",
    "no-unused-vars": "off",
    "no-inner-declarations": "off",
    "no-control-regex": "warn",
    "no-prototype-builtins": "warn",
    // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
};
