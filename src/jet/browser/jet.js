require('./compatible');

var jet = require('../util'),
    _module = require('../core/module');

require('./module');
require('./factory');
require('./request/xhr');
require('./request/style');
require('./request/script');

require('../config/base_url');
require('../plugins/tmpl');
require('../plugins/min');
require('../plugins/i18n');

jet.extend(jet, {
    use : _module.use ,
    loader: require('../core/loader'),
    factory: require('../core/factory'),
    config: require('../core/config'),
    request: require('../core/request'),
    shim: require('../core/shim')
});

(function export_global(){
    this.jet = jet;
    this.def = require('./loader');
}).call(null);

module.exports =  jet;