var _ = require('./type');

function extend() { // form jQuery & remove this
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
	if (_.isBoolean(target)) {
		deep = target;
		target = arguments[ i ] || {};
		i++;
	}
	if ( typeof target !== "object" && !_.isFunction(target) ) {
		target = {};
	}
	for ( ; i < length; i++ ) {
		options = arguments[ i ];
		/* jshint eqnull:true */
		if ( options != null ) {
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				if ( target !== copy ) {
					if ( deep && copy && ( _.isPlainObject(copy) || (copyIsArray = _.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && _.isArray(src) ? src : [];
						} else {
							clone = src && _.isPlainObject(src) ? src : {};
						}
						target[ name ] = extend( deep, clone, copy );
					} else {
						target[ name ] = copy;
					}
				}
			}
		}
	}
	return target;
}

module.exports.extend = extend;