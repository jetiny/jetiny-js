var _ = require('../util'),
    replaceVars = require('../config/vars'),
    parseUri = require('../config/package'),
    config = require('./config'),
    RE_DOT = /\/\.\//g,
    RE_DOUBLE_DOT = /\/[^/]+\/\.\.\//,
    RE_SINGAL_DOT = /\/\./g,
    RE_MULTI_SLASH = /([^:/])\/+\//g
    ;

// Canonicalize a path
// realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
function realpath(path) {
    path = path.replace(RE_DOT, "/");    // /a/b/./c/./d ==> /a/b/c/d
    path = path.replace(RE_MULTI_SLASH, "$1/"); //  a///b/////c ==> a/b/c
    while (path.match(RE_DOUBLE_DOT)) { // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
        path = path.replace(RE_DOUBLE_DOT, "/");
    }
    return path.replace(RE_SINGAL_DOT, ''); // remove /.
}

/*
{ 
    uri: 'E:/www/jetiny/dist/bower_components/jquery/dist/jquery.min.js',
    _symbole: [ 'jQuery', '$' ],
    _vars: [ 'min' ],
    _var: 'E:/www/jetiny/dist/bower_components/jquery/dist/jquery[min].js'
}
*/
function Resolve(url, refUrl){
    if (_.isArray(url)) {
        return url.map(function(it){
            return Resolve(it, refUrl);
        });
    }
    var dist = parseUri(url),
        uri = dist.uri,
        baseUrl = config('baseUrl');
    
    if (dist.relative) {
        uri = (refUrl ? _.dirname(refUrl) : baseUrl) + uri;
    } else if (!dist.absoulte) {
        uri =  baseUrl + uri;
    }
    uri = realpath(uri);
    
    var vars = [] ,
        _uri = replaceVars(uri, vars)
        ;
    if (vars.length) {
        dist._vars = vars;
        dist._var = uri;
    }
    delete dist.absoulte;
    delete dist.relative;
    dist.uri = _uri;
    return dist;
}

module.exports = Resolve;