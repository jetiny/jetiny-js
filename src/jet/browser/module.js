var _module = require('../core/module'),
    _document = document
    ;

_module.async = ("async" in _document.createElement("script") ) ||
    "MozAppearance" in _document.documentElement.style ||
    typeof opera !== 'undefined';