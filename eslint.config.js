// Flat config (ESLint 9). Bazuje na oficjalnym presecie Expo i włącza Prettiera
// jako regułę ESLint, dzięki czemu niezgodności formatowania są raportowane
// razem z błędami jakości kodu (jedno przejście `npm run lint`).
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  ...expoConfig,
  eslintPluginPrettierRecommended,
  {
    // Pliki testowe korzystają z globali Jest (describe/it/expect),
    // których nie ma w domyślnym środowisku — deklarujemy je tutaj.
    files: ["**/__tests__/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "web-build/**",
      "android/**",
      "ios/**",
    ],
  },
];
