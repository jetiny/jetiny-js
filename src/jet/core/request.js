var _requests = {};

function createRequest(type) {
    return function(req, callback) {
        var transport = _requests[type], _done, _timer;
        function finish(err, data) {
            if (_done)
                return ;
            _done = true;
            if(_timer)
                clearTimeout( _timer );
            req.response = data;
            if (callback)
                callback(err, req.response);
        }
        if (transport)
            transport = transport(req);
        
        if ( !transport ) {
        	return finish({message: "No Transport"});
        }
        
        if (req.timeout) {
        	_timer = setTimeout(function() {
                transport.abort();
                finish({message: "timeout"});
        	}, req.timeout );
        }
        
        transport.send(finish);
        return transport;
    };
}

function request(type, req, callback) {
    var fn = request[type];
    return fn(req, callback);
}

request.on = function (type, func){
    _requests[type] = func;
    request[type] = createRequest(type);
};

module.exports = request;