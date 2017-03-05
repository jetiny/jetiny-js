var _ = require('../util'),
    // config = require('../core/config'),
    // _packages = config().packages = {},
    _components = require('../core/priv').components
    ;

// config.on('packages', function(opts) {
//     _.each(opts, function(key, val) {
//         _packages[key] = _.isObject(val) ? val.path : val;
//     });
// });

// config.on('components', function(opts){
//     _.each(opts, function(key, it){
//         var mod = {
//                 alias:{},
//                 _package: it._package
//             },
//             _symboles = it.symboles || {},
//             _alias = it.alias || {};
//         if(!_alias.main)
//             _alias.main = it.main;
//         _.each(_alias, function(name, path){
//             mod.alias[name] = {
//                 path : path,
//                 symbole : _symboles[name]
//             };
//         });
//         mod.deps = it.deps;
//         mod.version = it.version;
//         _components[key] = mod;
//     });
// });

var RE_RELATIVE = /^\./,            // ./ ../
    RE_ABSOULTE = /((^)|(\:))\/\//     // start with /  or *:/
    // RE_PACKAGE_NAME = /([\w-]*?)*/
    ;

function parseUri(uri){
    var dist = {
            uri: uri
            //raw: uri
        }
        ;
    if (RE_RELATIVE.test(uri)) {
        dist.relative = true;
    } else if (!RE_ABSOULTE.test(uri)) {
        // bootstrap@css
        // jquery
        // bootstrap/dist/css/bootstrap.css
        var indexAt  = uri.indexOf('@'),
            indexDot = uri.indexOf('/'),
            file,
            entry,
            component // = RE_PACKAGE_NAME.exec(uri)[0]  // ie not support this regexp
            ;
        if (indexDot>0) {
            component = uri.substr(0, indexDot); // for ie
            file = uri.substr(++indexDot, uri.length);
        } else {
            component = (indexAt>0) ? uri.substr(0, indexAt) : uri; // for ie
            entry = (indexAt>0) ? uri.substr(++indexAt, uri.length) : null;
        }
        // generate
        var com = _components[component],
            tmp;
        if (com) {
            if (com.version) {
                dist._version = com.version;
            }
            tmp = com.entries && com.entries[entry || 'default'] || com;
            if (_.isObject(tmp)) {
                file = tmp.url;
                if (tmp.symbole) {
                    dist._symbole = tmp.symbole;
                }
                tmp = tmp.deps;
                if (tmp) {
                    dist.dependencies = _.isArray(tmp) ? tmp : [tmp];
                }
            } else {
                file = tmp;
            }
            if (component && file) {
                dist.uri = com._package.path + '/' + ( com.path || component ) +'/' + file;
            }
        }
    }
    
    if (RE_ABSOULTE.test(dist.uri)){
        dist.absoulte = true;
    }
    
    return dist;
}

// function parseUri(uri){
//     var dist = {
//             uri: uri
//             //raw: uri
//         }
//         ;
//     if (RE_RELATIVE.test(uri)) {
//         dist.relative = true;
//     } else if (!RE_ABSOULTE.test(uri)) {
//         // bootstrap@css
//         // jquery
//         // bootstrap/dist/css/bootstrap.css
//         var indexAt  = uri.indexOf('@'),
//             indexDot = uri.indexOf('/'),
//             file,
//             alias,
//             component // = RE_PACKAGE_NAME.exec(uri)[0]  // ie not support this regexp
//             ;
//         if (indexDot>0) {
//             component = uri.substr(0, indexDot); // for ie
//             file = uri.substr(++indexDot, uri.length);
//         } else {
//             component = (indexAt>0) ? uri.substr(0, indexAt) : uri; // for ie
//             alias = (indexAt>0) ? uri.substr(++indexAt, uri.length) : 'main';
//         }
//         // generate
//         var com = _components[component],
//             pkg,
//             ctx;

//         if (com) {
//             if (com.version)
//                 dist._version = com.version;
//             if (com._package) {
//                 pkg = _packages[com._package];
//             }
//             if (alias && com.alias) {
//                 ctx = com.alias[alias];
//                 file    = ctx.path;
//                 if (ctx.symbole)
//                     dist._symbole = ctx.symbole;
//             }
//             if (com.deps && (ctx = com.deps[alias || component])) {
//                 dist.dependencies = _.isArray(ctx) ? ctx : [ctx];
//             }
//         }
//         if (pkg && component && file) {
//             dist.uri = pkg + '/' + component +'/' + file;
//         }
//     }
    
//     if (RE_ABSOULTE.test(dist.uri)){
//         dist.absoulte = true;
//     }
    
//     return dist;
// }

module.exports = parseUri;