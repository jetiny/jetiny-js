var config = require('../core/config'),
    _ = require('../util');

function isDebug(key) {
    var debug = config('debug');
    if (debug) {
        if (_.isArray(debug)) {
            return debug.indexOf(key) >=0;
        } else if (_.isObject(debug)) {
            return debug[key];
        }
    }
    return debug;
}

module.exports = isDebug;