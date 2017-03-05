var history,
    
    exports,
    module,
    define,
    
    parse,
    stringify,
    
    __global__;

var process = {
    cwd: function(){}
}

var jet = {
    //base
    noop:function(){},
    slice:function(){},
    inArray: function(){},
    proxy: function(){},
    keys:function(){},
    randId:function(){},
    fileExtension:function () {},
    fileName:function () {},

    //birdge
    birdge:{
        apply: function(){}
    },
    //each
    each:function(){},
    splitEach:function(){},
    //event
    on:function(){},
    off:function(){},
    emit:function(){},
    //extend
    extend:function(){},
    //inherits
    inherits:{
        super_:{}
    },
    //query
    Query:{
        parse:function(){},
        stringify:function(){},
        boolval: true,
        intval: true
    },
    //Queue
    Queue:{
        next: function(){},
        prev: function(){},
        start: function(){},
        clone: function(){}
    },
    //route
    route:{
        caseInsensitive : false,
        path :"",
        regexp: 1,
        url:"",
        router:{
            pjax: {
                recv:1,
                container:1,
                error:1,
                pjaxUrl: "",
                pjaxSelector: ""
            }
        },
        match:function(){}
    },
    //tmpl
    tmpl: {
        inject:function(){},
        debug:false,
        extension:"html"
    },
    //tr
    tr: {
        locate: 'en',
        defaultLocate: 'en',
        module: function(){},
        extend: function(){},
        setLocate: function(){}
    },
    //type
    isType: function(){},
	isArray:function(){},
	isObject:function(){},
	isUndefined:function(){},
	isPlainObject:function(){},
    isBoolean:function(){},
    isNumber:function(){},
    isString:function(){},
    isFunction:function(){},
    isRegExp:function(){},
    isDate:function(){},
    isFile:function(){},
    //url
    Url : {
        parse: function(){},
        stringify: function(){},
        host: "",
        protocol: "",
        user: "",
        password: "",
        port: "",
        path: "",
        query: "",
        anchor: ""
    },
    //jet/core/config
    config:{
        on:function(){},
        //jet/config/base_url
        baseUrl:"",
        //jet/config/package
        packages : {
            name:"",
            path:""
        },
        components : {
            main:"",
            version:"",
            _package:"",
            symboles:[],
            alias: {}
        },
        //jet/config/debug
        debug:{
            min: true,
        },
        //jet/config/vars
        vars:{
            min:function(){},
            tmpl:function(){},
            locate:function(){}
        },
        //jet/plugins/i18n
        i18n:{
            locate:'en',
            defaultLocate:'en'
        }
    },
    factory:{
        next: function(){},
        prev: function(){},
        start: function(){},
        clone: function(){}
    },
    loader:{
        next: function(){},
        prev: function(){},
        start: function(){},
        clone: function(){},
        ext:''
    },
    request:{
        next: function(){},
        prev: function(){},
        start: function(){},
        clone: function(){}
    },
    bridge:{
        on:function(){}
    },
    use:function(){},
    
    nav: {
        start:1,
        reload:1,
        active:1,
        fragment:1,
        url:1
    },
    router: {
        find:function(){},
        match:function(){},
        url:function(){},
        
        id:"",
        options:{},
        
        path:"",
        data:{},
        args:{},
        router:null,
    },
    bootstrap:{
        routers:{
            id:1,
            args:1,
            router:1,
            data:1
        },
        nav:{
            event:1,
            redirect:1,
            prefix:1
        }
    }
}

function def(){
    
}

var ParseUrlInfo = {
    absoulte:1,
    relative:1,
    uri:1,
    _vars:1,
    _var:1,
    _version:1,
    _symbole:1,
    symbole:1,
    version:1
}

var ModuleProcess = {
    current:1,
    totle:1
}

var distModule = {
    use: 1,
    async : 1, // Element support async loading
    save: 1,
    getExports: 1,
    exec: 1
};