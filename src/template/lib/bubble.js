;
(function (root, factory) {
    /*global module, define*/
    if (typeof exports === 'object') {
        // COMMON-JS
        module.exports = factory();
    } else if (typeof define === 'function' && define['amd']) {
        // Asynchronous Module Definition AMD
        define([], factory);
    } else {
        //GLOBAL (e.g. browser)
        root['bubble'] = factory();
    }
}(this, function () {

    return function (element, options) {

        // Settings
        options = options || {};
        var invisibleStyle = '';
        if(options.grow){
            invisibleStyle = 'display: none;';
        }else{
            invisibleStyle = 'visibility: hidden;';
        }

        // Handler
        var handler = {}, text = element.innerText;
        handler.step = function () {
            var children = element.children;
            var $shown = children[0].cloneNode(true);
            var $hidden = children[1].cloneNode(true);
            var textShown = $shown.textContent;
            var textHidden = $hidden.textContent;
            $shown.textContent = textShown + textHidden.substr(0, 1);
            $hidden.textContent = textHidden.substr(1);
            element.innerHTML = "";
            element.appendChild($shown);
            element.appendChild($hidden);
            return (textHidden.substr(1).length > 0);
        };

        handler.start = function (callback, delay) {
            delay = (typeof delay === 'number')?delay:22;
            var run = function () {
                setTimeout(function () {
                    if (handler.step()) {
                        run();
                    } else {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                }, delay);
            };
            run();
        };

        handler.reset = function(){
            element.innerHTML = '<span class="show"></span><span class="hide" style="'+invisibleStyle+'">' + text.trim() + '</span>';
        };

        handler.reset();

        return handler;
    };

}));