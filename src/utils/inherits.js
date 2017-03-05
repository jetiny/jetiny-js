module.exports.inherits = typeof Object.create === 'function' ? function (ctor, superCtor) {
	ctor.super_ = superCtor;
	ctor.prototype = Object.create(superCtor.prototype, {
		constructor: {
			value: ctor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
} : function (ctor, superCtor) {
	ctor.super_ = superCtor;
	var TempCtor = function () {};
	TempCtor.prototype = superCtor.prototype;
	ctor.prototype = new TempCtor();
	ctor.prototype.constructor = ctor;
};