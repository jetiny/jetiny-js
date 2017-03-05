var config = require('../core/config'),
    _factory = require('../core/factory'),
    _ = require('../util');

config({
    vars:{
        tmpl: function(){
            return _.tmpl.extension || 'html';
        }
    }
});

// extension debug
config.on('tmpl', function(val){
    _.extend(_.tmpl, val);
});

_factory.next(function(next){
    var mod  = this.module, 
        data = this.exports;
    if (mod._vars && mod._vars.indexOf('tmpl') >=0) {
        if (_.isString(data)) {
            this.exports = _.tmpl(data, mod.uri);
        }
    }
    next();
});