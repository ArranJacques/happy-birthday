/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "<regex_match_files>": ["ts-jest", { diagnostics: false }],
  },
};
