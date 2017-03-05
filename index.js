var jet = require('./src/jet/node/jet');


module.exports = jet;

/*
jet.use('./test/fixtures/node_loader/test.css', function(css){
    console.log(css);
});

jet.use('./test/fixtures/node_loader/test.[tmpl]', function(func){
    console.log(func({title:'aaa'}));
});

jet.use('./test/fixtures/locate/[i18n].json', function(tr){
    console.log(tr('title'));
});

*/