def(['jquery'], function($){
    return {
        render: function(route){
            $('.page-container').html($('<pre>').append(JSON.stringify(route, null, 4)));
        }
    }
});