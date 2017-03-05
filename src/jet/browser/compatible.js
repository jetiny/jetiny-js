//!COMPATIBLE (IE8)
//-----------------------------------------------------------------------------compatible
var pa = Array.prototype,
	ps = String.prototype,
    po = Object.prototype
    ;
// array
if (!pa.forEach)
	pa.forEach = function(fn,scope){
		for (var i = 0, l = this.length >>> 0; i < l; i++){
			if(i in this)
				fn.call(scope, this[i], i, this);
		}
	};

if (!pa.indexOf)
	pa.indexOf = function(it,from){
		for (var l = this.length >>> 0, i = (from < 0) ? Math.max(0, l + from) : from || 0; i < l; i++){
			if (this[i] === it)
				return i;
		}
	    return -1;
	};

if (!pa.map)
	pa.map = function(fn,scope){//IE-8没有该方法
	    for (var r = [],i = 0, l = this.length >>> 0; i < l; i++) {
	        r.push(fn.call(scope, this[i], i, this));
	    }
	    return r;
	};

// string
if (!ps.trim)
	ps.trim = function(){
		return (this || "").replace(/^\s+|\s+$/g, "");
	};

//!COMPATIBLE