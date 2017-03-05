var RE_URI_TRIM = /(\?.*)|(#.*)/,
	RE_WIN_DOT = /\\/g,
	RE_LAST_DOT = /\\|\/$/,
    RE_URI_EXT = /\.([a-zA-z0-9]+)$/i,
    RE_DIRNAME = /[^?#]*\//,
    RE_FILE_NAME = /([^\\\/]+)$/;

module.exports = {
	'noop': function (){
	},
	'slice': function(args, startIndex){
		return Array.prototype.slice.call(args, startIndex || 0);
	},
	'inArray': function(ary, it) {
		return ary && ary.indexOf(it) >=0;
	},
	'proxy': function( fn, context ){
		return function(){
			fn.apply(context, arguments);
		};
    },
	'keys': Object.keys,
	'randId': function () {
		return Math.round((new Date().getTime())+Math.random()*1000001);
	},
	'fileExtension': function (url) {
	    var _url;
	    return (_url = String(url || '')
	            .replace(RE_URI_TRIM,'')
	            .match(RE_URI_EXT)
	           ) ? _url[1].toLowerCase() :'';
	},
	'fileName': function (url) {
	    var _url;
	    return (_url = String(url || '')
	            .replace(RE_URI_TRIM,'')
	            .replace(RE_WIN_DOT, '/')
	            .match(RE_FILE_NAME)
	           ) ? _url[1].toLowerCase() :'';
	},
	'trimUrl': function (url) {
        var x = url.indexOf('#'),
            y = url.indexOf('?'),
            m = (x === -1) ? y : (y === -1 ? x : Math.min(x, y));
	    return m === -1 ? url : url.substr(0, m);
	},
	// Extract the directory portion of a path
	// dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
	// ref: http://jsperf.com/regex-vs-split/2
	'dirname': function (path, todir) {
	    var r = path && path.match(RE_DIRNAME);
	    if (r) {
	    	r = todir ? r[0].replace(RE_LAST_DOT, '') : r[0];
	    }
	    return r || path;
	}
};