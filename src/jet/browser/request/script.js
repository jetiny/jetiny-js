var _request = require('../../core/request'),
    _document = document,
    _headElement =_document.head ||  _document.getElementsByTagName("head")[0] || _document.documentElement,
    _currentlyAddingScript,
    interactiveScript
    ;

function getCurrentScript() {
  if (_currentlyAddingScript) {
    return _currentlyAddingScript;
  }
  if (interactiveScript && interactiveScript.readyState === "interactive") {
    return interactiveScript;
  }
  var scripts = _headElement.getElementsByTagName("script");
  for (var i = scripts.length - 1; i >= 0; i--) {
    var script = scripts[i];
    if (script.readyState === "interactive") {
      interactiveScript = script;
      return interactiveScript;
    }
  }
}

function handleElement(el, _abort) {
    if ("onload" in el) {
        el.onload = el.onerror = _abort;
    } else {
        el.onreadystatechange = function() {
            if (/loaded|complete/.test(el.readyState)) {
                _abort(true);
            }
        };
    }
}

_request.on('script', function(req) {
    var _abort;
    return {
        send: function(complete){
            var el = _document.createElement('script');
            el.type= "text/javascript";
            el.src = req.url;
            el.id  = req.id;
            
            el.defer = false;
            el.async = false;
            
            _abort = function( evt ) {
                el.onload = el.onerror = el.onreadystatechange =  _abort = null;
                if ( evt ) {
                    complete( evt.type === "error" ? true : null);
                }
                el = null;
            };
            handleElement(el, _abort);
            
            _currentlyAddingScript = el;
            _headElement.insertBefore(el, _headElement.lastChild);
            _currentlyAddingScript = null;
        },
        abort: function(){
            if (_abort)
                _abort();
        }
    };
});

module.exports = getCurrentScript;