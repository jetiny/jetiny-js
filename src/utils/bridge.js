var _handles = [];

function bridge(name, callback) {
	var _prev = _handles[name];
	_handles[name] = callback;
	return _prev || function(){};
}

bridge.apply = function (name) {
	return _handles[name] && _handles[name].apply(null, _handles.slice.call(arguments, 1));
};

module.exports.bridge = bridge;