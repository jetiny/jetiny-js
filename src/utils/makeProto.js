var _each = require('./each').each;

module.exports.makeProto = function makeProto(func, arr, cb) {
	_each(arr, function(i, name) {
		func.prototype[name] = cb(name);
	});
};
