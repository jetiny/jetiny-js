// @SOURCE vue/src/util/env.js
module.exports.nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;
  function handle () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks = [];
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    var counter = 1;
    var observer = new MutationObserver(handle);
    var textNode = document.createTextNode(counter);
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = counter;
    };
  } else {
    timerFunc = setTimeout;
  }
  return function (cb, ctx) {
    var func = ctx ? function () { 
      	cb.call(ctx); 
      } : cb;
    callbacks.push(func);
    if (pending) return;
    pending = true;
    timerFunc(handle, 0);
  };
})();