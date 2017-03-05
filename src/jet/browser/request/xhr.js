var _request = require('../../core/request');

_request.on('xhr', function(req) {
    var _abort;
    return {
        send: function(complete){
            var xhr = new XMLHttpRequest();
            xhr.id  = req.id;
            xhr.open('GET', req.url, true );
            // callback
            function handle( type ) {
                return function() {
                    if ( _abort ) {
                        _abort = xhr.onload = xhr.onerror = xhr.onreadystatechange = null;
                        if ( type === "abort" ) {
                            xhr.abort();
                        } else if ( type === "error" ) {
                            complete ({message: 'request error!'});
                        } else {
                            if (xhr.readyState == 4 ) {
                                if (xhr.status > 399 && xhr.status < 600) {
                                    complete ({message: 'request status error!', error: xhr.status});
                                } else {
                                    var data =  xhr.responseText;
                                    try {
                                        if (req.dataType == 'json') {
                                            data = JSON.parse(xhr.responseText);
                                        } else if (data.dataType == 'xml') {
                                            data = xhr.responseXML;
                                        }
                                    } catch (err) {
                                        return complete(err);
                                    }
                                    complete ( null, data);
                                }
                            }
                        }
                    }
                };
            }
            // Listen to events
            if ('onload' in xhr) {
                xhr.onload  = handle();
                xhr.onerror = handle("error");
            } else {
                var done = handle();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 ) {
                        done();
                    }
                };
            }
            _abort      = handle("abort");
            xhr.send(null);
        },
        abort: function(){
            if (_abort)
                _abort();
        }
    };
});

