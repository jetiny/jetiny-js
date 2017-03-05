var isDebug = require('../config/debug');

require('../core/config')({
    vars:{
        min: function(){
            return isDebug('min') ? '' : '.min';
        }
    }
});
