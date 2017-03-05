module.exports = {
    packages:{
        "bower": {
            "name": "bower",
            "path": "bower_components"
        }
    },
    components:{
        "jquery": {
            "main":"dist/jquery[min].js",
            "version": "2.1.3",
            "_package": "bower",
            "symboles":{
                "main":["jQuery", "$"]
            }
        },
        "bootstrap":{
            "main": "dist/js/bootstrap[min].js",
            "version": "3.3.2",
            "_package": "bower",
            "alias":{
                "css":  "dist/css/bootstrap[min].css",
                "theme":"dist/css/bootstrap-theme[min].css"
            },
            "symboles":{
                "main":"jQuery"
            }
        },
        "nprogress":{
            "main": "nprogress.js",
            "version": "0.1.6",
            "_package": "bower",
            "alias":{
                "css":  "nprogress.css",
                "extras":  "support/extras.css",
                "style":  "support/style.css"
            },
            "assets":[
                "font/*"
            ],
            "symboles": {
                "main": ["NProgress"]
            }
        },
        "font-awesome":{
            "_package": "bower",
            "main": "css/font-awesome.css",
            "version": "4.3.0"
        }
    }
};