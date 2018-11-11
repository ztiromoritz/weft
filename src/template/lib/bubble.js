export default (element, options) => {

    // Settings
    options = options || {};
    var invisibleStyle = '';
    if (options.grow) {
        invisibleStyle = 'display: none;';
    } else {
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

    handler.start = function (delay) {
        delay = (typeof delay === 'number') ? delay : 22;
        return new Promise((resolve) => {
            const run = () => {
                setTimeout(() => handler.step() ? run() : resolve(), delay);
            };
            run();
        });
    };

    handler.reset = function () {
        element.innerHTML = '<span class="show"></span><span class="hide" style="' + invisibleStyle + '">' + text.trim() + '</span>';
    };

    handler.reset();

    return handler;
};

