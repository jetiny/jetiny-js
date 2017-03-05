function each(obj, iterator, context) {
	if (obj) {
		var _length = obj.length, _key;
		if (_length === +_length ) {// array like
			for (_key = 0 ; _key < _length; _key++) {
				if (false === iterator.call(context, _key, obj[_key])) {
					return obj;
				}
			}
		} else { //object
			for (_key in obj) {
				if (obj.hasOwnProperty(_key)) {
					if (false ===iterator.call(context, _key, obj[_key])) {
						return obj;
					}
				}
			}
		}
	}
	return obj;
}

module.exports = {
	'each': each,
	'splitEach': function (arr, callback, chr, context) {
		return each(arr.split(chr || " "), callback , context);
	}
};