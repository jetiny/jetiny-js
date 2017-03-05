var _loader = require('../core/loader'),
    _request = require('../core/request'),
    _module = require('../core/module'),
    parseDependencies = require('../../utils/deps'),
    getCurrentScript = require('./request/script'),
    _resolve = require('../core/resolve'),
    _ = require('../util')
    ;

_loader.next(function(next, recv){
    if (this.ext ==='json') {
        this.dataType = "json";
        _request('xhr', this, next);
        return this.loadNext();
    }
    else  if (this.ext ==='css') {
        _request('style', this, next);
        return this.loadNext();
    }
    else if (this.ext ==='html' || this.ext === 'txt') {
        _request('xhr', this, next);
        return this.loadNext();
    }
    else  if (this.ext ==='js' || this.ext === '') {
        var url = this.url;
        _request('script', this, function(err){
            if (anonymousMeta) {
               _module.save(_.trimUrl(anonymousMeta._uri || url), anonymousMeta);
               anonymousMeta = null;
            }
            next(err);
        });
        if (!this.module._symbole) {// amd or cmd
            this.loadNext();
        }
        return ;
    }
    next(null, recv);
});

var anonymousMeta;

// Define a module
function module_define(id, deps, factory) {
  var argsLen = arguments.length, amd = false;
  // define(factory)
  if (argsLen === 1) {
    factory = id;
    id = undefined;
  }
  else if (argsLen === 2) {
    factory = deps;
    // define(deps, factory)
    if (_.isArray(id)) {
      deps = id;
      id = undefined;
      amd = true;
    }
    // define(id, factory)
    else {
      deps = undefined;
    }
  }

  // Parse dependencies according to the module factory code
  if (!_.isArray(deps) && _.isFunction(factory) && !amd) {
      deps = parseDependencies(factory.toString());
  }

  var meta = {
    //id: id,
    _uri: id ? _resolve(id).uri : "",
    _amd: amd,
    dependencies: deps || [],
    factory: factory
  };

  // Try to derive uri in IE6-9 for anonymous modules
  if (!meta.uri && document.attachEvent) {
    var script = getCurrentScript();
    if (script) {
      meta._uri = script.src;
    }
    // NOTE: If the id-deriving methods above is failed, then falls back
    // to use onload event to get the uri
  }
  if (meta._uri)
    _module.save(meta._uri, meta);
  else
     anonymousMeta = meta;
}

module.exports = module_define;