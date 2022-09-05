module.exports = {
    mongodbMemoryServerOptions: {
      binary: {
        skipMD5: true,
      },
      autoStart: false,
      instance: {
        //   dbName: 'jest'
      },
      useSharedDBForAllJestWorkers: false
    },
  };
