function Queue (context, done , queues){
	
    function Q (err){
        var args = arguments;
		if (!err){
			var it = Q._queues.shift();
			if (it) {
				if (args.length)
                    args[0] = Q;
                else
                    args = [Q];
                return it.apply(Q._context, args);
			}
		}
		return Q._done && Q._done.apply(Q._context, args);
	}
    
    Q._queues = queues || [];
    Q._context = context || null;
    Q._done = done;
    
    Q.unshift = function(args){
        Q._queues.unshift.apply(Q._queues, args);
        return Q;
    };
    Q.push = function(args){
        Q._queues.push.apply(Q._queues, args);
        return Q;
    };

    Q.next = function(func){
        Q._queues.push(func);
        return Q;
    };
    Q.prev = function(func){
        Q._queues.unshift(func);
        return Q;
    };
    Q.start = function(){
        Q(null);
    };
    Q.clone = function(context, done , queues){
        return Queue(context || Q._context, done || Q._done, queues || Q._queues.slice());
    };

    Q.done = function() {
        Q._queues.length = 0;
        return Q._done && Q._done.apply(Q._context, arguments);
    };
    
    return Q;
}

module.exports.Queue = Queue;
