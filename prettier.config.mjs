/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  printWidth: 120,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  overrides: [
    {
      files: ["*.jsonc"],
      options: {
        parser: "json",
        trailingComma: "none",
      },
    },
  ],
};

export default config;
