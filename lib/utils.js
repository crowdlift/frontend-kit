import { _ } from 'lodash';

// Setup variables to be injected into JavaScript via the DefinePlugin
// Only the variable values are injected, making it easy for UglifyJS to prune code paths
export const jsonStringifyDeep = definitions =>
  _.each(definitions, (val, key) => {
    // eslint-disable-next-line no-param-reassign
    definitions[key] = _.isString(val) ?
      JSON.stringify(val) :
      jsonStringifyDeep(definitions[key]);
  });

export const cloneDeep = _.cloneDeep;
