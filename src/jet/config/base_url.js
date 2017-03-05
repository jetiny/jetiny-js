var config = require('../core/config');

config.on('baseUrl', function setBaseUrl(val){
    return val.replace(/\\/g, '/');
});

config({
    baseUrl: ((typeof location !== 'undefined') && location.href.match(/[^?#]*\//)[0]) ||
        ((typeof process !== 'undefined')  && process.cwd()+'/' )
});
