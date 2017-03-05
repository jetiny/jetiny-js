var _loader = require('../util').Queue(),
    _ = require('../util'),
    config = require('../core/config'),
    isDebug = require('../config/debug');

var _loaderIdx = 0;

var _version;

_loader.fetch = function (mod, dist) {
    dist.module = mod ;
    dist.ext = _.fileExtension(dist.url);
    dist.id = '__request'+(++_loaderIdx);
    if (isDebug('url')) {
        dist.url +='?_ver' + (_version || (_version = Date.now ? Date.now() : new Date().getTime()));
    } else {
        var ver = mod._version || config('version');
        if (_.isFunction(ver)) {
            ver = ver(mod);
        }
        if (ver) {
            dist.url +='?_ver' + ver;
        }
    }
    
    var func = _loader.clone(dist, function(err, data) {
        if (data != func) {
            dist.respond(err, data || dist.factory);
        } else {
            dist.respond(err);
        }
    });
    func.start();
};

module.exports = _loader;