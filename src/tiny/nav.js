module.exports = function(_) {
    var _extend = _.extend,
        Url = _.Url,
        is_active,      //是否已经启动
        is_hash,        //使用hash事件
        is_push,        //使用history事件
        is_redirect,    //支持push到hash的重定向
        s_hash = 'hash',
        s_push = 'push',
        cur_fragment,     //当前地址
        root_prefix='',   //地址前缀
        org_uri = Url.parse(location.href)
        ;
    _extend(nav, {
        //action
        start: function nav_start(opts){
            if (!opts) opts = {};
            var event  = opts.event || s_hash;
            if (location.origin === 'file://' ) { //local file protocol can not use history pushState
                is_push = false;
            } else {
                if (event === s_push){
                    if (!(is_push = !!(history && history.pushState)))
                        event = s_hash; // push down to hash
                }
                is_redirect = opts.redirect;
            }
            is_hash = ('onhashchange' in window) && (event === s_hash) ;
            root_prefix = nav_path_slash(opts.prefix || ''); // prefix should not be end with /
            if (is_push) {
                $on(window, 'popstate', nav_handle_event);
            } else if (is_hash) {
                $on(window, 'hashchange', nav_handle_event);
            }
            is_active = 1;
            nav( opts.fragment || nav_get_fragment() );
        },
        reload: function nav_reload(){
            nav(cur_fragment, true);
        },
        //status
        active: function(){
            return !!is_active;
        },
        fragment: function(){
            return cur_fragment;
        },
        //parse url
        parse: nav_parse_url,
        //make url
        url: function(fragment, type) {
            var dist = {
                query:'', // remove
                anchor:''
            };
            if (is_redirect || is_push || type === s_push) {
                dist.path = root_prefix + fragment;
            } else {
                dist.anchor = '!'+fragment;
            }
            return Url.stringify(_extend({}, org_uri, dist));
        },
        // send a notify
        notify: nav_notify
    });

    function nav_get_fragment() {
        return nav_parse_url(location.href);
    }

    function nav_handle_event() {
        var fragment = nav_get_fragment();
        if (fragment === cur_fragment)
            return false;
        if(is_push){
            cur_fragment = fragment;
            history.replaceState({}, document.title, nav_build_url(fragment));
            nav_notify(fragment);
        }else if(is_hash){
            cur_fragment = fragment;
            nav_notify(fragment);
        }
    }

    function nav(fragment, focus) {
        var _equal;
    	if (fragment && (focus || !(_equal = cur_fragment === fragment))) {
    		if (is_push) {
    			cur_fragment = fragment;
    			history[_equal ? 'replaceState' : 'pushState']({}, document.title, nav_build_url(fragment) );
    			nav_notify(fragment);
    		} 
            else if(is_hash) {
    			if (is_redirect && (nav_path_slash(location.pathname) != root_prefix)){ //reload from normal url to hash url
                    return location.replace(root_prefix + nav_build_url(fragment));
                }
                cur_fragment = fragment;
                location.hash = nav_build_url(fragment);
                nav_notify(fragment);
    		} else {
    			cur_fragment = fragment;
    			nav_notify(fragment);
    		}
    	}
    }

    function $on(element, eventName, callback) {
        if (element.addEventListener)
            element.addEventListener(eventName, callback, false);
        else if (element.attachEvent)
            element.attachEvent("on" + eventName, callback);
    }

    function nav_path_slash(s){
        var _r = ('/' + (s || '') + '/').replace(/\/+/g, '/');
        return _r.substr(0, _r.length -1);
    }

    function nav_notify(fragment){
        var _url = Url.parse(fragment);
        _.bridge.apply('nav', {
            fragment: fragment,
            path  : _url.path,
            query : _.Query.parse(_url.query),
            anchor: _url.anchor
        });
    }

    function nav_build_url(fragment){
        return (is_push ? root_prefix : '#!') + fragment;
    }

    function startWith(str, tar) {
        return str.substr(0, tar.length) == tar;
    }

    // localhost/path/dir/file*
    // /path/dir/file*
    // #!/path/dir/file*

    function nav_parse_url(url){
        var _url = Url.parse(url);
        //@TODO check cross domain
        
        if (startWith(_url.anchor, '!/')) {//is vaild hash url (#!/)
            _url = Url.parse(_url.anchor.substr(1));
        } else if (_url.path === ""){ // empty url change to /
            _url.path = '/';
        } else if(is_redirect || is_push){// hash support redirect | push
            if (startWith(_url.path, root_prefix)){ // cut abs url
                _url.path = _url.path.substr(root_prefix.length) || '/';
            } else {
                return;
            }
        } else if  (org_uri.path == _url.path){// hash path is empty or equal to location.filename value /
            _url.path = '/';
        } else {
            return;
        }
        
        return Url.stringify({
            path  : _url.path,
            query : _url.query,
            anchor: _url.anchor
        });
    }

    return nav;
};
