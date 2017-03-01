'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneDeep = exports.jsonStringifyDeep = undefined;

var _lodash = require('lodash');

// Setup variables to be injected into JavaScript via the DefinePlugin
// Only the variable values are injected, making it easy for UglifyJS to prune code paths
var jsonStringifyDeep = exports.jsonStringifyDeep = function jsonStringifyDeep(definitions) {
  return _lodash._.each(definitions, function (val, key) {
    // eslint-disable-next-line no-param-reassign
    definitions[key] = _lodash._.isString(val) ? JSON.stringify(val) : jsonStringifyDeep(definitions[key]);
  });
};

var cloneDeep = exports.cloneDeep = _lodash._.cloneDeep;