var _factory = require('../core/factory'),
    _module = require('../core/module'),
    _ = require('../util')
    ;

_factory.next(function(next){
    var mod = this.module,
        data = this.exports;
    if (this.isFactory) {// factory in module
        if (_.isFunction(data)) { // process function
            if (mod._amd) { // amd mode
                data = data.apply(null, _module.getExports(mod));
            } else { // cmd mode (default)
                var require = function (id) {
                        return _module.exec(mod.deps[id]);
                    },
                    module={},
                    r = data(require, module.exports = {}, module);
                if (r !== undefined) {
                    data = r;
                } else {
                    data = module.exports;
                }
            }
        }
    } else { // global symbole mode
        var symbole = mod._symbole;
        if (_.isArray(symbole))
            symbole = symbole[0];
        if (symbole) {
            /*jshint -W054 */
            var func = new Function('', 'return this["' + symbole + '"];');
            /*jshint +W054 */
            data = func.call(null);
        }
    }
    this.exports = data;
    next();
});
