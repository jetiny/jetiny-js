var _ = require('../util'),
    config = require('../core/config'),
    _vars = config().vars = {}
    ;

config.on('vars', function(val){
    _.extend(_vars, val);
});

var RE_VARS = /\[([^\[]+)\]/g;
function replaceVars(uri, vars) {
  if (uri.indexOf("[") > -1) {
    uri = uri.replace(RE_VARS, function(m, key) {
        var func = _vars[key];
        if (vars)
            vars.push(key);
        if (func) {
            return _.isFunction(func) ? func(uri) : func;
        }
        throw new Error('var no found: ' + key + ' for url:' + uri);
    });
  }
  return uri;
}

module.exports = replaceVars;
