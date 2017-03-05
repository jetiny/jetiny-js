var _configs = {},
    _configListeners = {},
    _ = require('../util');

function config(opts, val) {
    // dump
    var argc = arguments.length;
    if (argc === 0)
        return _configs;
    if (argc === 2) {
        var it = {};
        it[opts] = val;
        opts = it;
    }
    // read
    if (_.isString(opts)) {
        var r = _configs;
        _.splitEach(opts, function(_, it){
            r = r && r[it];
        }, '.');
        return r;
    }
        
    // write
    var func;
    for(var x in opts) {
        if (_.isFunction(func = _configListeners[x])){ // filter
            if ((val = func(opts[x], x, _configs)) !== undefined) {
                _configs[x] = val; // then set
            }
        }
        else {
            _configs[x] = opts[x]; // just set
        }
    }
}

config.on = function (key, func){
    _configListeners[key] = func;
};

module.exports = config;
