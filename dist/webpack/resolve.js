'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var getResolve = function getResolve(config) {
  return {
    extensions: ['.js', '.json'],
    modules: [config.dir.vendor, 'node_modules'],
    enforceExtension: false,
    enforceModuleExtension: false,
    unsafeCache: false,
    symlinks: true
  };
};

exports.default = getResolve;