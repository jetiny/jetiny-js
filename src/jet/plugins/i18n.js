var config = require('../core/config'),
    _factory = require('../core/factory'),
    _mod = require('../core/module'),
    _ = require('../util');

config({
    vars:{
        i18n: function(){
            return _.tr.local;
        }
    }
});

config.on('i18n', function(val){
    _.extend(_.tr, val);
});

var _cachedVarMods = [],
    _tr = _.tr;
_tr.setLocal = function(local){
    if (_tr.local !== local) {
        _tr.local = local;
        _mod.use(_cachedVarMods, function(){
            _.emit('translate', _tr);
        });
    }
};

_factory.next(function(next){
    var mod  = this.module, 
        data = this.exports;
    if (mod._vars && mod._vars.indexOf('i18n') >=0) {
        if (_.isObject(data)) {
            _tr.extend(data);
            this.exports = _tr;
        }
        if (_cachedVarMods.indexOf(mod._var) == -1)
            _cachedVarMods.push(mod._var);
    }
    next();
});
