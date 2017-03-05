
// page-ajax version
var RE_ABSOULTE = /((^)|(\:))\/\//;
var prev = jet.bridge('route', function(route){
    if (route.pjax) {
        var url = route.pjax;
        if (!RE_ABSOULTE.test(route.pjax)) {
            url = (jet.config('pjaxUrl') || jet.config('baseUrl')) + url;
        }
        var req = {
            url: url,
            dataType: 'html',
            data: route.args
        };
        route.request = req;
        route.send = function(cb){
            jet.request('xhr', route.request, cb);
        };
    } else {
        prev(route);
    }
});

