var toString = Object.prototype.toString,
    isArray = Array.isArray || isType("Array"),
	_ = require('./each');

function isType(type) {
    return function(t) {
        return toString.call(t) === "[object " + type + "]";
    };
}

module.exports = {
	'isType': isType,
	'isArray': isArray,
	'isObject': function (val) {
		/* jshint eqnull:true */
		return val != null && typeof val === 'object' && !isArray(val);
	},
	'isUndefined': function ( val ) {
		return typeof val === 'undefined' ;
	},
	'isPlainObject': function ( obj ) {
		return !!(obj && obj.constructor === Object.prototype.constructor);
	}
};

//@NOTE need Blod type ?
_.splitEach("Boolean Number String Function RegExp Date File", function(id, it){
    module.exports["is"+it] = isType(it);
});