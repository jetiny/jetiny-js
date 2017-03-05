var _extend = require('../utils/extend').extend,
	_nextTick = require('../utils/nextTick').nextTick,
	_makeProto = require('../utils/makeProto').makeProto,
	_each = require('../utils/each').each,
	_event = require('../utils/event').event,
	_Queue = require('../utils/queue').Queue,
	_ = require('../utils/type') ;

//-------------------------------------------------------DataSource

	function DataSource(opts) {
		this._modules = {};
		this._config = _extend(true, {}, DataSource.defaultConfigs, opts);
		this.fetch = _Queue();
	}

	DataSource.defaultConfigs = {
		baseUrl:'',		//基础地址
		type: 'GET',    //默认方法
		multi: {
			array  : 'modules', //如果指定key则使用Array，否则使用Object
			field : false,		//列表是否使用键值对模式
			name : 'name',		//列表键值对的键名
			value: 'value',
			get: {
				path: '/multi/get'   //默认的请求地址
			},
			post: {
				path: '/multi/post'   //默认的请求地址
			}
		}
	};

	_makeProto(DataSource, ['prepare','success', 'fail', 'done'], function(name, key) {
		key = '_' + name ;
		return function(module_path, callback) {
			if (!callback && _.isFunction(module_path)) {
				callback = module_path;
				module_path = null;
			}
			if (callback) {
				(this[key] || (this[key] = [])).push([module_path, callback]);
			}
			return this;
		};
	});

	_makeProto(DataSource, ['get', 'post'], function(type) {
		type = type.toUpperCase();
		return function(path, data) {
			return this.request({
				type: type,
				path: path,
				data: data
			});
		};
	});

	DataSource.prototype.request = function(opts) {
		var name = opts.module || opts.path;
		if (name) {
			var module = this._modules[name];
			if (module) {
				_extend(true, opts, module.opts);
			}
		}
		var handle = new Handler(this, opts),
			that = this;
		_nextTick(function(){
			if (!handle.owner())
				that._send(handle);
		});
		return handle;
	};

	DataSource.prototype._send = function(handle) {
		handle._emitPrepare(function(err){
			if (!err) {
				var source = handle.source;
				var opts = handle.request();
				opts.url = source.config('baseUrl') + opts.path;
				source._fetch(opts, function(err, data) {
					handle._emitDone(err, data);
				});
			}
		});
	};

	DataSource.prototype._emit = function(name, module_path, args) {
		var key = '_' + name ;
		if (this[key]) {
			_each(this[key], function(id, it) {
				if (it[0] === module_path || !it[0]) {
					it[1].apply(null, args);
				}
			});
		}
	};

	DataSource.prototype._queuePrepare = function(module_path, q) {
		if (this._prepare){	
			_each(this._prepare, function(id, it) {
				if (it[0] == module_path || !it[0]) {
					q.next(it[1]);
				}
			});
		}
	};

	DataSource.prototype.config = function(name, value) {
		if (_.isObject(name)) {
			_extend(true, this._config, name);
		} else if (arguments.length === 1) { // read
			return this._config[name];
		} else {
			this._config[name] = value;
		}
		return this;
	};

	DataSource.prototype.module = function(name) {
		return this._modules[name];
	};

	DataSource.prototype.defineModule = function(name, value) {
		if (_.isObject(name)) {
			this._modules[name.module] = new Module(name.module, name);
		} else {
			if (!_.isObject(value)) {
				value = {
					path: value
				};
			}
			this._modules[value.module = name] = new Module(name, value);
		}
		return this;
	};

	DataSource.prototype.defineModules = function(type, value) {
		var that = this;
		_each(value, function(name, val){
			if (!_.isObject(val)) {
				val = {
					path: val
				};
			}
			val.type = type;
			that._modules[val.module = name] = new Module(name, val);
		});
		return this;
	};

	DataSource.prototype._fetch = function(options, callback) {
		return this.fetch.clone(options, callback).start();
	};

//-------------------------------------------------------Module

	function Module(name, opts) {
		this.name = name;
		this.opts = opts;
	}

//-------------------------------------------------------Handler

	function Handler(source, opts) {
		this.type = opts.type.toLowerCase();
		this.options = opts;
		this.source = source;
		this.event = _event(this._events = {});
		//this.items = []; // multi
	}

	_makeProto(Handler, ['prepare','success', 'fail', 'done'], function(name) {
		return function(value) {
			if (value) {
				this.event.on(name, value);
			}
			return this;
		};
	});

	// multi-call
	Handler.prototype.multi = function() {
		var that = this;
		_each(arguments, function(id, it) {
			that.join.apply(that, it);
		});
		return this;
	};
	// multi-call join
	Handler.prototype.join = function() {
		var next = this.source[this.type].apply(this.source, arguments);
		var owner = next._owner = this._owner || this;
		( owner.items || (owner.items = []) ).push(next);
		return next;
	};

	Handler.prototype.owner = function() {
		return this._owner;
	};

	Handler.prototype.request = function() {
		var opts;
		if (this.items) {
			var lists = this.items.slice(0);
			lists.unshift(this);
			var multiKey = this.source.config('multi');
			var data = {};
			if (multiKey.array) { // array mode
				var ldata = [];
				var asArr = !(multiKey.field && multiKey.name && multiKey.value);
				_each(lists, function(tmp, hand) {
					if (asArr) {
						ldata.push([hand.options.path, hand.options.data]);
					} else {					
						tmp = {};
						tmp[multiKey.name]  = hand.options.path;
						tmp[multiKey.value] = hand.options.data;
						ldata.push(tmp);
					}
				});
				data[multiKey.array] = ldata;
			} else { // object mode
				_each(lists, function(id, hand){
					data[hand.options.path] = hand.options.data;
				});
			}
			opts = _extend(true, {}, this.options, multiKey[this.type]);
			opts.data = data;
			opts.module = 'multi';
			opts.multi = true;
		} else {
			opts = _extend(true, {}, this.options);
		}
		opts.handler = this;
		return opts;
	};

	Handler.prototype._queuePrepare = function(q) {
		this.source._queuePrepare(this.modulePath(), q);
		if (this._events.prepare) {
			q.push(this._events.prepare);
		}
	};

	Handler.prototype._emitPrepare = function(next) {
		var q = _Queue(this, next);
		this._queuePrepare(q);
		if (this.items) {
			_each(this.items, function(id, it){
				q.next(function(_next){
					it._emitPrepare(_next);
				});
			});
		}
		q.start();
	};

	Handler.prototype._emitDone = function(err, data) { // err 为int或字符串
		if (this.items) { // multi
			var cdata = data || [];
			this._recv(err, cdata[0]);
			for(var i=0, l = this.items.length, it; i < l ; ++i) {
				it = this.items[i];
				it._emitDone(err , cdata[i+1]);
			}
		} else {
			this._recv(err, data);
		}
	};

	Handler.prototype._recv = function(err, data) {
		data = data || { error:'err.not_recv' };
		data.error = err || data.error;
		if ( data.error ) {
			this._emit('fail', [data, this]);
		} else {
			this._emit('success', [data.data, this]);
		}
		this._emit('done', [data.error, data, this]);
	};

	Handler.prototype.modulePath = function() {
		return this.options.module || this.options.path;
	};

	Handler.prototype.modulePaths = function() {
		var dist = [];
		dist.push([this.options.module, this.options.path]);
		if (this.items) {
			_each(this.items, function(id, it) {
				dist.push([it.options.module, it.options.path]);
			});
		}
		return dist;
	};

	Handler.prototype._emit = function(name, args) { // success fail done
		this.source._emit(name, this.modulePath(), args);
		args.unshift(name);
		this.event.emit.apply(null, args);
	};

//-------------------------------------------------------Test
	// var drv = new DataSource({});

	// drv.defineModule('user_age', 'user/age');
	// drv.defineModule('user_name', {
	// 	path : 'user/name',
	// 	type: 'get'
	// });
	// drv.defineModules('GET', {
	// 	"user_info" : 'user/info',
	// 	"me" : {
	// 		path: "me"
	// 	}
	// });

	// function jqueryFetch(next, data) {
	// 	if (data) {
	// 		return next(null, data);
	// 	}
	// 	var opts = this;
	// 	opts.dataType = 'JSON';
	// 	$.ajax(opts).always(function(data_xhr, statusText){
	// 		if (statusText === 'error') {
	// 			next('err.status_' + data_xhr.status);
	// 		} else if (opts.multi) { // array
	// 			next(null, data_xhr);
	// 		} else {
	// 			if (data_xhr && data_xhr.error) {
	// 				next(data_xhr.error);
	// 			} else {
	// 				next(null, data_xhr);
	// 			}
	// 		}
	// 	});
	// }

	// var pathMaps = {
	// 	'user/info' 	: {data: {name:'jetiny', age: 30}},
	// 	'user/age' 		: {data: {age: 31}},
	// 	'user/name' 	: {data: {name:'bob'}},
	// 	'me' 			: {data: {name:'sina', age: 32}}
	// };

	// function simulatorFetch(next) {
	// 	if (this.multi) {
	// 		var paths = this.handler.modulePaths();
	// 		var dist = [];
	// 		_each(paths, function(tmp ,it){
	// 			tmp = pathMaps[it[0]] || pathMaps[it[1]];
	// 			if (tmp){
	// 				dist.push(tmp);
	// 			} else {
	// 				dist.push({error: 'err.not_recv'});
	// 			}
	// 		});
	// 		next(dist.length ? null : {error:'err.not_recv'}, dist);
	// 	} else {
	// 		console.log(this);
	// 		var data = pathMaps[this.handler.modulePath()];
	// 		if (data) {
	// 			next(null, data);
	// 		} else {
	// 			next(null);
	// 		}
	// 	}
	// }

	// drv.fetch.push([simulatorFetch, jqueryFetch]);

	// drv.prepare(null, function(next){
	// 	console.log('DataSource.prepare', arguments, this);
	// 	next();
	// }).success(null, function(data, handle){
	// 	console.log('DataSource.success', data, handle);
	// }).fail(null, function(err, data, handle){
	// 	console.log('DataSource.fail', err, data, handle);
	// }).done(null, function(err, data, handle){
	// 	console.log('DataSource.done', err, data, handle);
	// });

	// drv.get('me').join('user_name').multi(['user_info', {}], ['user_age'], ['mmx']);

	// window.drv = drv;
module.exports.DataSource = DataSource;