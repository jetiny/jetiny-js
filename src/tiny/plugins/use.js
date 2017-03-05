// def use version
var prev = jet.bridge('route', function(route){
    if (route.use) {
        route.send = function(cb){
            jet.use(route.use, cb);
        };
    } else {
        prev(route);
    }
});

