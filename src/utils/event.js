function TinyEvent(_events) {
    if (!_events) {
       _events = {};
    }
    var dist = {
        'on' : function (event, callback){
            var list = _events[event] || (_events[event] = []);
            list.push(callback);
        },
        'off' : function (event, callback){
            var list = _events[event];
            if (list) {
                if (callback) {
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (list[i] === callback) {
                            list.splice(i, 1);
                        }
                    }
                } else {
                    delete _events[event];
                }
            }
        },
        'once' : function (event, callback){
            var fn = function() {
                dist.off(event, fn);
                callback.apply(null, arguments);
            }
            dist.on(event, fn);
        },
        'emit' : function (event){
            var list = _events[event];
            if ( list ) {
                list = list.slice();
                var fn, args = list.slice.call(arguments, 1);
                while ((fn = list.shift())) {
                    fn.apply(null, args);
                }
            }
        },
        'walk' : function(event, fn, context) {
            var list = _events[event];
            if ( list ) {
                list = list.slice();
                for (var i = list.length - 1; i >= 0; i--) {
                    fn.call(context || null, list[i]);
                }
            }
        }
    };
    return dist;
}

module.exports = TinyEvent();
module.exports.event = TinyEvent;