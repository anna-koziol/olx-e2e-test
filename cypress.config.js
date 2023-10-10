const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 6000,
    setupNodeEvents(on, config) {
      on("before:run", (details) => {});
    },
    experimentalInteractiveRunEvents: true,
  },
});
