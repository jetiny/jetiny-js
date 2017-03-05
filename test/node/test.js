var jet = require('../../dist/jet_node').jet,
    configs = require('./config');

jet.config({
    baseUrl: __dirname + '/'
});

jet.config(configs);

jet.use(['../fixtures/node_loader/test.css'], function(r){
    console.log(r);
});

jet.use(['../fixtures/locate/[i18n].json'], function(tr){
    console.log(jet.tr('title'));
});
