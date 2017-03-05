var _ = require('./extend'); //require type

module.exports = _.extend(_,
    require('./base'),            
    require('./type'),            
    require('./each'),            
    require('./queue'),           
    require('./inherits'),        
    require('./event'),           
    require('./bridge'),          
    require('./tmpl'),            
    require('./url'),             
    require('./query'),
    require('./route'),
    require('./tr')               
);
