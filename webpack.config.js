module.exports = {
  // ... other configuration settings ...

  resolve: {
    fallback: {
      "process": require.resolve("process/browser")
    }
  }
};
