var isOldWebKit = Number(navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1")) < 536,
    _request = require('../../core/request'),
    _document = document,
    _headElement =_document.head ||  _document.getElementsByTagName("head")[0] || _document.documentElement
     ;

function pollCss(node, callback, timeout) {
    var sheet = node.sheet ,isLoaded ;
    // for WebKit < 536
    if (isOldWebKit) {
    	if (sheet)
    		isLoaded = true;
    } else if (sheet) {// for Firefox < 9.0
    	try {
    		if (sheet.cssRules)
    			isLoaded = true;
    	} catch (ex) {
    		// The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
    		// to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
    		// in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
    		if (ex.name === "NS_ERROR_DOM_SECURITY_ERR")
    			isLoaded = true;
    	}
    }
    if ((timeout -= 20) < 0) {
        return callback(-1);
    }
    setTimeout(function() {
    	if (isLoaded) {// Place callback here to give time for style rendering
    		callback(1);
    	} else {
    		pollCss(node, callback, timeout);
    	}
    }, 20);
}

_request.on('style', function(req) {
    var _abort;
    return {
        send: function(complete){
            var el = _document.createElement('link'), _timer;
            el.href = req.url;
            el.id  = req.id;
            el.async = true;
            el.rel = 'stylesheet';
            _abort = function( evt ) {
                el.onload = el.onerror = _abort = null;
                if(_timer)
                    clearTimeout( _timer );
                if ( evt  !== 0) {
                    complete( (evt === -1) ? true : null);
                }
                el = null;
            };
            if (isOldWebKit || !('onload' in el)) {
                _timer = setTimeout(function() {
        			pollCss(el, function(r){
                        if (_abort)
                            _abort(r);
                    }, req.timeout || 30000); //force timeout 30s
        		}, 0);
            } else {
                el.onload = el.onerror = _abort;
            }
            _headElement.insertBefore(el, _headElement.lastChild);
        },
        abort: function(){
            if (_abort)
                _abort(0);
        }
    };
});
