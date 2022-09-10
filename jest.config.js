module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  moduleDirectories: ["node_modules", "src"],
};
