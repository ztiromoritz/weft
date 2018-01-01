(function (global) {
    global.chatter = {};
    const $chat = document.querySelector("#chat");


    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    function addClass(el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }

    var regex = /<<([^\s]*) "([^"]*)">>/;
    var parseContent = function (str) {
        var match = regex.exec(str);
        console.log(str, match);
        return {
            user: match[1] === 'MO' ? "me" : "other",
            content: match[2]
        };
    };


    /**
     * !!What a Salat!
     * @param $element
     * @param options
     * @param nextCallback
     */
    function renderOptions($element, options, nextCallback) {

        var removeCallbacks = [];

        var removeAllClickListeners = function () {
            removeCallbacks.forEach(function (cb) {
                cb();
            });
        };

        options
            .map(function (option) {
                var $option = document.createElement('div');
                $option.innerHTML = option.getContent();
                var onClick = function () {
                    removeAllClickListeners();
                    if (typeof nextCallback === 'function')
                        nextCallback(option.getLabel());
                };
                $option.addEventListener('click', onClick);
                removeCallbacks.push(function () {
                    $option.removeEventListener('click', onClick);
                });
                return $option;
            })
            .forEach(function ($option) {
                $element.appendChild($option);
            });
    }

    /**
     * @returns {Promise<HTMLElement>}
     */
    chatter.showOptions = function (options) {
        console.log('show options');

        return new Promise(function (resolve) {
            var onSelected = function (selectedLabel) {
                // noinspection JSIgnoredPromiseFromCall should be done just in time
                chatter.hideOptions();
                resolve(selectedLabel) // <-- resolves when option is selected
            };
            var $options = document.querySelector(".options");
            renderOptions($options, options, onSelected);
            addClass($options, 'show');
            removeClass($options, 'hide');
            var onTransitioned = function () {
                $options.removeEventListener("transitionend", onTransitioned);
            };
            $options.addEventListener("transitionend", onTransitioned);
        });
    };

    /**
     * @returns {Promise<HTMLElement>}
     */
    chatter.hideOptions = function () {
        return new Promise(function (resolve) {
            var $options = document.querySelector(".options");
            addClass($options, 'hide');
            removeClass($options, 'show');
            var onTransitioned = function () {
                $options.innerHTML = "";
                $options.removeEventListener("transitionend", onTransitioned);
                resolve($options);
            };
            $options.addEventListener("transitionend", onTransitioned);

        });
    };

    /**
     *
     * @param {{content, user, typing}} msg
     * @param {Function} [done]
     */
    chatter.addMessage = function (msg, done) {
        const $answerWrapper = document.getElementById('answerInput');
        const $answerButton = document.getElementById('answerButton');
        const $message = document.createElement("div");
        $message.classList.add("message");
        $message.classList.add(msg.user);
        // $chat.appendChild($message);
        $chat.scrollTop = $chat.scrollHeight;


        const writeTyping = function () {
            return new Promise(function (resolve) {
                if (msg.user === 'me') {
                    var $answer = document.createElement('span');
                    $answer.innerHTML = msg.content;
                    var handler = bubble($answer, {grow: true});
                    $answerWrapper.appendChild($answer);

                    var submitMessage = function(){
                        removeClass($answerButton, 'glow');
                        $answerButton.removeEventListener('click', submitMessage);
                        $chat.appendChild($message);
                        $answer.innerHTML = "";
                        resolve();
                    };

                    handler.start(function () {
                        addClass($answerButton,'glow');
                        $answerButton.addEventListener('click', submitMessage);
                    }, 30);
                } else {
                    $message.innerHTML = '<div class="content typing"><span></span><span></span><span></span></div>';
                    $chat.appendChild($message);
                    setTimeout(resolve, msg.typing);
                }
            });
        };
        const writeMessage = function () {
            console.log("write message");
            $message.innerHTML = '<div class="user"></div>' +
                '<div class="content">' + msg.content + '</div>';
            $chat.scrollTop = $chat.scrollHeight;
            if (typeof done === 'function') {
                done();
            }
        };
        writeTyping().then(function () {
            writeMessage();
        });
    };


    var Type = lmn.Step.Type;
    var dialogStore = new lmn.DialogStore();
    dialogStore.addDialog("default", exampleDialog);

    var dialog = dialogStore.startDialog("default");


    var wait = function (timeout, callback) {
        return function () {
            setTimeout(callback, timeout);
        };
    };

    var nextStep = function (index) {
        var step = dialog.next(index);
        console.log(step);
        switch (step.getType()) {
            case Type.MESSAGE:
                var parsed = parseContent(step.getContent());
                chatter.addMessage({
                    user: parsed.user,
                    content: parsed.content,
                    typing: 1500
                }, wait(1500, nextStep));
                break;
            case Type.QUESTION:
                chatter.showOptions(step.getAvailableOptions()).then(function (selectedIndex) {
                    nextStep(selectedIndex);
                });
                break;
            case Type.END:
            case Type.UNFINISHED_DIALOG:
            default:
        }
    };

    nextStep();


})(this);