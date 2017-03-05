var RE_REPLACE = /([().])/g,
    RE_REPLACE2  = /([\/$\*])/g,
    RE_MATCH   = /(\/)?:(\w+)([\?\*])?/g ;
var route = module.exports.route = function (path, opts) {
	var _keys = [], 
		_path = path
		  .replace(RE_REPLACE, '\\$1')
		  .replace(RE_MATCH, function(_, slash, key, option){
			var optional = option === '?' ? option : null;
			var star = option === '*' ? option : null;
			_keys.push({ name: key, optional: !!optional });
			slash = slash || '';
			return '' +
              (optional ? '' : slash) +
              '(?:' + 
              (optional ? slash : '') +
              (star && '(.+?)' || '([^/]+)') +
              (optional || '') + 
              ')' + 
              (optional || '');
		  })
		  .replace(RE_REPLACE2, '\\$1');
    if (!opts)
        (opts = {});
	var cr = path[path.length-1];
	if (cr != '/' && cr != '*'){
		(_path += '(?:\\/)?'); // in case no / at end
	}
    var _regexp = new RegExp( '^' + _path + '$' , 
            opts.caseInsensitive || route.caseInsensitive ? 'i' : ''),
        rt = {
            path   : path ,          // origin path
            regexp : _regexp,        // parse url
            url    : function(args){ // create Url (return false when miss required argument)
                if(!args)
                    args = {};
                return path.replace(RE_MATCH, function(_, slash, key, option){
                      if (option === '?'){
                          return (args[key] && slash || '') + (args[key] || '');
                      } else {
                          return (slash || '') + (args[key] || '');
                      }
                });
            },
            match  : function(uri){  // match url
                var _matchs = _regexp.exec(uri);
                if (_matchs){
                    var args = {};
					for(var i = 1,l=_matchs.length; i<l;i++){
                        args[_keys[i-1].name] = _matchs[i] || "";
                    }
                    return args;
                }
            },
            keys   : _keys          // keys
        };
    return rt;
};