var _ = require('../utils/extend'); //require type

module.exports = _.extend(_,
    require('../utils/base'),            
    require('../utils/type'),            
    require('../utils/each'),            
    require('../utils/queue'),           
    require('../utils/event'),           
    require('../utils/tmpl'),            
    require('../utils/url'),             
    require('../utils/query'),  
    require('../utils/bridge'),              
    require('../utils/tr')               
);
