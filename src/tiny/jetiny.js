var jet = require('../jet/browser/jet');

jet.extend(jet, 
    require('../utils/bridge'),
    require('../utils/nextTick'),
    require('../utils/classExtend'),
    require('./pagecontrol'),
    require('./datasource')
    );

var route = require('../utils/route').route,
	_router = require('./router')(jet, route),
	_nav = require('./nav')(jet);

jet.nav = _nav;
jet.router = _router;

function redirect(fragmentId, args) {
    var url = _router.url(fragmentId, args) || fragmentId;
    _nav.notify(url);
}

jet.bridge('nav', function(entry) {
    jet.extend(entry, _router.match(entry.path), {
        redirect: redirect
    });
    jet.bridge.apply('route', entry);
});

require('./plugins/pjax');
require('./plugins/use');

jet.redirect = function(fragmentId, args) {
    var url = _router.url(fragmentId, args) || fragmentId;
    _nav(url, true);
};

jet.bootstrap = function (opts) {
	if (!opts)
		opts = {};
	_router(opts.routers);
    _nav.start(opts.nav);
};

