// i18n (en + ?) 
var _extend = require('./extend').extend,
    _locals = {};

function tr(ns, key) {
    var path = key ? (ns+'.'+key) : ns,
        r = translate(_locals[tr.local], _locals[tr.defaultLocal], path.split('.'), tr.defaultLocal == tr.local);
    if (r[0])
        return r[1];
    return r[1] || ('['+path+']');
}

tr.extend = function(datas, abbr){
    if(!abbr)
        abbr = tr.local;
    _extend(true, _locals[abbr] || (_locals[abbr] = {}), datas);
};

tr.module = function(ns) {
    return function(key) {
        return tr(ns, key);
    };
};

tr.local = tr.defaultLocal = 'en';

function translate(local, defaultLocal, paths, equal) {
    var it,
        items = paths.slice();
    while((it = items.shift())) {
        if (local){
            local = local[it];
        }
        else break;
    }
    if (local)
        return [true, local];
    if (equal)
        return [false];
    while((it = paths.shift())) {
        if (defaultLocal){
            defaultLocal = defaultLocal[it];
        }
        else break;
    }
    return [false, defaultLocal];
}

module.exports.tr = tr;