jet.shim({ //包
    name : "bower",
    path : "bower_components"
}, { // 组件
    "font-awesome": "css/font-awesome.css", // 精简模式
    "jquery" : { // 包模式
        "version": "2.1.3",                 //版本，缺省不指定
        "path": "jquery",                   //路径, 缺省为包名称
        "url" : "dist/jquery.js",           //入口(entry) url
        "symbole" : "jQuery",               //导出符号
        "alias": "$"                        //别名
    },
    "bootstrap" : {
        "version": "3.3.2",
        "url"       : "dist/js/bootstrap.js",
        "deps"      : ["$", 'bootstrap@css'],  //依赖
        "symbole"   : "$",
        "entries": { // 多个入口
            "css": "dist/css/bootstrap.css",
            "theme" : {
                "url"       : "dist/css/bootstrap-theme.css",
                "deps"      : "bootstrap@css",  // 依赖单个
            }
        }
    },
    "nprogress":{
        "version": "0.1.6",
        "entries": {
            "default": {// 默认入口
                "url"       : "nprogress.js",
                "symbole"   : "NProgress",
            },
            "css":  "nprogress.css",
            "extras":  "support/extras.css",
            "style":  "support/style.css"
        },
    }
});