var _ = require('../util'),
	priv = require('./priv'),
	packages = priv.packages,
	components = priv.components;

function shim (pkg, items) {
	if (_.isString(pkg)) {
		pkg = {
			name: pkg,
			path: pkg
		};
	}
	pkg = packages[pkg.name] || (packages[pkg.name] = pkg);
	_.each(items, function(name, it){
		it = _.isString(it) ? {
			url: it
		} : it;
		it._package = pkg;
		components[name] = it;
		if (it.alias) {
			components[it.alias] = it;
		}
	});
}

module.exports = shim;