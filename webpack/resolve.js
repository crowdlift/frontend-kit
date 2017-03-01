
const getResolve = config =>
  ({
    extensions: ['.js', '.json'],
    modules: [
      config.dir.vendor,
      'node_modules',
    ],
    enforceExtension: false,
    enforceModuleExtension: false,
    unsafeCache: false,
    symlinks: true,
  });

export default getResolve;
