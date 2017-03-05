var _factory = require('../util').Queue();

_factory.exec = function (mod, dist) {
    dist.module = mod;
    _factory.clone(dist).start(); // sync
};

module.exports = _factory;