module.exports = {
    mongodbMemoryServerOptions: {
      binary: {
        version: 'v6.0-latest',
        skipMD5: true,
      },
      autoStart: false,
      instance: {
          dbName: 'jest'
      },
    },
  };
