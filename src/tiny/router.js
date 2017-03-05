module.exports = function(_, router_create) {

    var routers = {};

    function router(items, opts){
        var _id;
        _.each(items, function(url, it){
            if (_.isObject(it)) {
                _id = it.id;
            } else {
                _id = it;
                it = {};
            }
            routers[_id] = _.extend(router_create(url, it.options || opts), {
                id:_id,
                data:it
            });
        });
        return router;
    }

    _.extend(router, {
        "find" : function(id){
            return id ? routers[id] : routers;
        },
        "match" : function(path){
            var _id, _args;
            for (_id in routers) {
                _args = routers[_id].match(path);
                if (_args){
                    return _.extend({
                        id: _id,
                        args : _args
                    }, routers[_id].data);
                }
            }
        },
        "url" : function(id, args){ // return ""(no router)
            return routers[id] && routers[id].url(args) || "";
        }
    });

    return router;

};