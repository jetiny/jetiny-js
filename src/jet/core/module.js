var _ = require('../util'),
    _factory = require('./factory'),
    _loader = require('./loader'),
    _resolve = require('./resolve'),
    _config = require('./config'),
    
    _cachedMods = {},
    fetchingList = {},
    fetchedList  ={},
    callbackList = {},
    STATUS = {
        FETCHING: 1,    // 1 - The `module.uri` is being fetched
        SAVED: 2,       // 2 - The meta data has been saved to _cachedMods
        LOADING: 3,     // 3 - The `module.dependencies` are being loaded
        LOADED: 4,      // 4 - The module are ready to execute
        EXECUTING: 5,   // 5 - The module is being executed
        EXECUTED: 6,    // 6 - The `module.exports` is available
        ERROR: 7        // 7 - 404
    },
    _progress = {
        totle:   0,
        current: 0
    }
    
    ;

var distModule = module.exports = {
    use: use,
    async : true, // Element support async loading
    save: module_save,
    getExports: module_get_exports,
    exec: module_exec
};

function module_progress(uri, startLoad) {
    if (startLoad)
        _progress.totle++;
    else
        _progress.current++;
    _.emit('progress', _progress.current, _progress.totle, uri, startLoad);
}

function module_pass(mod){
    var len = mod.dependencies.length;
    for (var i = 0; i < mod._entry.length; i++) {
        var entry = mod._entry[i];
        var count = 0;
        for (var j = 0; j < len; j++) {
            var m = mod.deps[mod.dependencies[j]];
            // If the module is unload and unused in the entry, pass entry to it
            if (m.status < STATUS.LOADED && !entry._history.hasOwnProperty(m.uri)) {
                entry._history[m.uri] = true;
                count++;
                m._entry.push(entry);
                if(m.status === STATUS.LOADING) {
                    module_pass(m);
                }
            }
        }
        // If has passed the entry to it's dependencies, modify the entry's count and del it in the module
        if (count > 0) {
            entry._remain += count - 1;
            mod._entry.shift();
            i--;
        }
    }
}

// Load module.dependencies and fire onload when all done
function module_load(mod){
    if (mod.status >= STATUS.LOADING) {
        return;
    }
    var deps = module_resolve_deps(mod);
    mod.status = STATUS.LOADING;
    module_pass(mod);
    // If module has entries not be passed, call onload
    if (mod._entry.length) {
        module_complete(mod);
        return;
    }
    // both async or sync load
    var _queues = _.Queue(null, function(){});
    _.each(deps, function(id, m){
        _queues.next(function(next){
            if (m.status < STATUS.FETCHING) {
                var _fetch = function() {
                    if (!distModule.async) {
                        return module_fetch(m, next);
                    }
                    module_fetch(m);
                };
                if (m.dependencies && m.dependencies.length) {
                    module_use(m.dependencies, _fetch, m.uri);
                } else {
                    _fetch();
                }
            }
            else if (m.status === STATUS.SAVED) {
                module_load(m);
            }
            next();
        });
    });
    _queues.start();
    // module_use(deps,  function(){
    // }, mod.uri);
}

// Call this method when module is loaded
function module_complete(mod, err) {
    mod.status = err ? STATUS.ERROR : STATUS.LOADED;
    // When sometimes cached in IE, exec will occur before onload, make sure len is an number
    for (var i = 0, len = (mod._entry || []).length; i < len; i++) {
        var entry = mod._entry[i];
        if (--entry._remain === 0) {
            entry._callback();
        }
    }
    delete mod._entry;
}

function module_exec(mod) {
    if (mod.status >= STATUS.EXECUTING) {
        return mod.exports;
    }
    mod.status = STATUS.EXECUTING;
    if (mod._entry && !mod._entry.length) {
        delete mod._entry;
    }
    var dist = {};
    if ((dist.isFactory = mod.hasOwnProperty('factory'))) {
        dist.exports = mod.factory;
    }
    _factory.exec(mod, dist);
    delete mod.factory;
    mod.exports = dist.exports;
    mod.status = STATUS.EXECUTED;
    return mod.exports;
}

function module_fetch(mod, sync) {
    mod.status = STATUS.FETCHING;
    var requestUri = mod.uri;
    if (requestUri in fetchedList) {
        module_load(mod);
        return sync && sync(null);
    }
    if (requestUri in fetchingList) {
        callbackList[requestUri].push(mod);
        return sync && sync(null);
    }
    fetchingList[requestUri] = true;
    callbackList[requestUri] = [mod];
    
    function onRequest(error, data) {
        module_progress(mod.uri, false);
        if (data !== undefined) {
            module_save(mod, {
                factory: data
            });
        }
        delete fetchingList[requestUri];
        fetchedList[requestUri] = true;
        var m, mods = callbackList[requestUri];
        delete callbackList[requestUri];
        if (sync) 
            sync(null);
        var hasError = !!error;
        while ((m = mods.shift())) {
            if(hasError) {
                module_complete(m, error);
            }
            else {
                module_load(m);
            }
        }
    }
    module_progress(mod.uri, true);
    _loader.fetch(mod, {
        url: requestUri,
        respond: onRequest,
        loadNext: function(){
            if (sync) {
                sync(null);
                sync = null;
            }
        }
    });
}

// save module meta data
function module_save(mod, meta){
    mod = _.isObject(mod) ? mod : _cachedMods[mod];
    if (mod.status < STATUS.SAVED) {
        if (meta) {
            for(var x in meta) {
                mod[x] = meta[x];
            }
        }
        mod.status = STATUS.SAVED;
    }
}

// init module to dist object
function module_init(dist, deps){
    dist.status = 0;
    dist.dependencies =  deps || [];
    dist.deps = {};
    dist._entry = [];
    return dist;
}

// walk module deps order
function module_walk_deps(mod, ctx, func){
    _.each(mod.dependencies, function(dep, it){
        dep = mod.deps[it];
        if (!dep) {
            dep = _resolve(it, mod.uri);
            if (_cachedMods[dep.uri]) {
                mod.deps[it] = dep = _cachedMods[dep.uri];
            } else {
                mod.deps[it] = _cachedMods[dep.uri] = module_init(dep, dep.dependencies);
            }
        }
        func(dep, ctx);
    });
    return ctx;
}

// get resolved module deps
function module_resolve_deps(mod){
    return module_walk_deps(mod, [], function(dep, ctx){
        ctx.push(dep);
    }, true);
}

// get module executed deps
function module_get_exports(mod){
    return module_walk_deps(mod, [], function(dep, ctx){
        ctx.push(module_exec(dep));
    });
}

// Use function is equal to load a anonymous module
function module_use(ids, callback, uri) {
    var mod = module_init({ uri : uri }, _.isArray(ids) ? ids : [ids]);
    mod._entry.push(mod);
    mod._history = {};
    mod._remain = 1;
    mod._callback = function() {
        var exports = module_get_exports(mod);
        if (callback) {
            callback.apply(null, exports);
        }
        delete mod._callback;
        delete mod._history;
        delete mod._remain;
        delete mod._entry;
    };
    module_load(mod);
}

function use (ids, callback) {
    module_use(ids, callback, _config('baseUrl') + "_use_");
}

