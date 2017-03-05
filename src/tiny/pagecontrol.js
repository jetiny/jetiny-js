var _classExtend = require('../utils/classExtend').classExtend,
	_extend = require('../utils/extend').extend,
	_nextTick = require('../utils/nextTick').nextTick,
	_ = require('../utils/base') ;

	function Page(options) {
		this.init(options);
	}

	Page.defaultOptions = {
		template: '<div class="page-item"></div>'
	};

	Page.extend = _classExtend;

	Page.prototype.init = function(options) {
		this.options = _extend(true, this.options || {}, Page.defaultOptions, options);
		this._el = element(this.options.template);
		// this._el.innerHTML = Math.random();
	};

	Page.prototype.destroy = function() {
	};
/*
	NewPage->attach
		OldPage->hide + NewPage->show
			->OldPage->detach
				->OldPage->back + NewPage->front
*/
	Page.prototype.attach = function(el) {
		el.appendChild(this._el);
	};

	Page.prototype.hide = function(cb) {
		this._el.style.display = 'none';
		_nextTick(cb);	
	};

	Page.prototype.show = function(cb) {
		this._el.style.display = 'block';
		_nextTick(cb);
	};

	Page.prototype.detach = function(el) {
		el.removeChild(this._el);
	};

	Page.prototype.front = function() {
	};

	Page.prototype.back = function() {
	};

	Page.prototype.done = function(active) {
		this._active = active;
	};

	function PageControl(options) {
		this._pages = [];
		this._currPage = null;
		this.init(options);
	}

	PageControl.Page = Page;
	PageControl.extend = _classExtend;

	PageControl.defaultOptions = {
		selector: '.page-container', //选择器
		limit : 1 //同时存在的个数限制
	};

	PageControl.prototype.init = function(options) {
		this.options = _extend(true, this.options || {}, PageControl.defaultOptions, options);
		this._el = document.querySelector(this.options.selector);
	};

	PageControl.prototype.active = function(page, done) {
		if (this._currPage !== page) {
			page.attach(this._el);
			this.toggle(page, this._currPage, _.proxy(this._done, this), done);
		}
	};

	PageControl.prototype._done = function(pageShow, pageHide, done) {
		this._currPage = pageShow;
		// this._prevPage = pageHide;
		var limit = this.options.limit;
		if (limit > 1) {
			if (this._pages.indexOf(pageShow) === -1) 
				this._pages.push(pageShow);
			while( this._pages.length > limit) {
				pageHide = this._pages.shift();
				pageHide.detach(this._el);
				pageHide.back();
				pageHide.destroy();
			}
		} else if(pageHide) {
			pageHide.detach(this._el);
			pageHide.back();
			pageHide.destroy();
		}
		pageShow.front();
		if (done) {
			done();
		}
	};

	PageControl.prototype.toggle = function(pageShow, pageHide, callback, done) {
		var num = 1;
		if (pageHide) {
			++num;
			pageHide.hide(function(){
				if (--num === 0) {
					callback(pageShow, pageHide, done);
				}
			});
		}
		pageShow.show(function(){
			if (--num === 0) {
				callback(pageShow, pageHide, done);
			}
		});
	};

	// var pc = new PageControl({

	// });

	// pc.active(new Page({a:'aa'}), function(){
	// 	console.debug(pc._currPage);
	// 	pc.active(new Page({a:'bb'}), function(){
	// 		console.debug(pc._currPage);
	// 		pc.active(new Page({a:'cc'}), function(){
	// 			console.debug(pc._currPage);
	// 		});
	// 	});
	// });

	// return pc;

function element( a ){
	var el = document.createElement("p");
	el.innerHTML = a;
	return el.firstChild;
}

module.exports.PageControl = PageControl;
module.exports.Page = Page;