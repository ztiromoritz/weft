(function (root, factory) {
    /*global module, define, define*/
    /* istanbul ignore next */
    if (typeof exports === 'object') {
        // COMMON-JS
        module.exports = factory();
    } else if (typeof define === 'function' && define['amd']) {
        // Asynchronous Module Definition AMD
        define([], factory);
    } else {
        //GLOBAL (e.g. browser)
        root['chatter'] = factory();
    }
}(this, function () {
    'use strict';
    var chatter = {};
    var $chat = document.querySelector("#chat");


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
            user: match[1].toLowerCase() === 'me' ? "me" : match[1],
            content: match[2]
        };
    };

    /**
     * !!What a Salad!
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

    function getImageUrl(users, username) {
        var url = null;
        users.forEach(function (user) {
            if (username === user.name) {
                url = user.url;
            }
        });
        return url;
    }

    function getBackgroundStyle(username) {
        var bg = chatter_util.stringToColour(username);
        var color = chatter_util.invertColor(bg);
        return 'background-color: ' + bg + '; color: ' + color + ';';
    }


    /**
     *
     * @param {{content, user, typing}} msg
     * @param {Function} [done]
     */
    chatter.addMessage = function (msg, users) {

        return new Promise(function (resolve, reject) {


            var $answerWrapper = document.getElementById('answerInput');
            var $answerButton = document.getElementById('answerButton');
            var $messageWrapper = document.createElement("div");
            $messageWrapper.classList.add("message-wrapper");
            $messageWrapper.classList.add(msg.user.toLowerCase() === 'me' ? 'me' : 'other');
            var $message = document.createElement("div");
            if (msg.user.toLowerCase() !== 'me') {

                var imageUrl = getImageUrl(users, msg.user);
                if (imageUrl) {
                    var $icon = document.createElement("img");
                    $icon.src = imageUrl;
                    $icon.classList.add("user");
                    $messageWrapper.appendChild($icon);
                } else {
                    var $letter = document.createElement("div");
                    $letter.classList.add("user");
                    $letter.classList.add("letter");
                    $letter.innerHTML = msg.user[0].toUpperCase();
                    $messageWrapper.appendChild($letter);
                }
            }
            $messageWrapper.appendChild($message);
            $message.classList.add("message");
            $message.classList.add(msg.user.toLowerCase() === 'me' ? 'me' : 'other');

            $chat.scrollTop = $chat.scrollHeight;


            var writeTyping = function () {
                return new Promise(function (resolve) {
                    if (msg.user.toLowerCase() === 'me') {
                        var $answer = document.createElement('span');
                        $answer.innerHTML = msg.content;
                        var handler = bubble($answer, {grow: true});
                        $answerWrapper.appendChild($answer);

                        var submitMessage = function () {
                            removeClass($answerButton, 'glow');
                            $answerButton.removeEventListener('click', submitMessage);
                            $chat.appendChild($messageWrapper);
                            $answer.innerHTML = "";
                            resolve();
                        };

                        handler.start(function () {
                            addClass($answerButton, 'glow');
                            $answerButton.addEventListener('click', submitMessage);
                        }, 30);
                    } else {
                        $message.innerHTML = '<div class="content typing"><span></span><span></span><span></span></div>';
                        $chat.appendChild($messageWrapper);
                        setTimeout(resolve, msg.typing);
                    }
                });
            };
            var writeMessage = function () {
                console.log("write message");
                $message.innerHTML = '<div class="content">' + msg.content + '</div>';
                speech.say(msg.content.replace(/(<([^>]+)>)/ig, ""));
                $chat.scrollTop = $chat.scrollHeight;
                resolve();
            };
            writeTyping().then(function () {
                writeMessage();
            });

        });
    };


    chatter.showErrorMessage = function (message) {
        var $errorMessage = document.getElementById('error-message');
        $errorMessage.innerHTML = message;
        addClass($errorMessage, 'show');
        $errorMessage.addEventListener('click', chatter.hideErrorMessage);
    };

    chatter.hideErrorMessage = function () {
        var $errorMessage = document.getElementById('error-message');
        $errorMessage.removeEventListener('click', chatter.hideErrorMessage);
        removeClass($errorMessage, 'show');
    };

    var Type = lmn.Step.Type;
    var dialogStore = new lmn.DialogStore();

    if (typeof CHATTER_DIALOG !== 'undefined') {

        dialogStore.addDialog("default", CHATTER_DIALOG);
        var dialog = dialogStore.startDialog("default");

        var wait = function (timeout) {
            return new Promise(function (resolve) {
                setTimeout(resolve, timeout);
            });
        };

        var nextStep = function (index) {
            var step = dialog.next(index);
            switch (step.getType()) {
                case Type.MESSAGE:
                    var command = step.getContent(); // TODO: step.getCommand()
                    // TODO: assert that every command is :msg for now
                    if(command.name != 'msg')
                        throw new Error("Command not supported", command.name)
                    var msg = {
                        user: command.args[0],
                        content: command.args[1],
                        typing: 1500
                    };
                    chatter.addMessage(msg, CHATTER_DIALOG.data.users)
                        .then(wait(1500))
                        .then(nextStep);
                    break;
                case Type.QUESTION:
                    chatter.showOptions(step.getAvailableOptions())
                        .then(nextStep);
                    break;
                case Type.END:
                case Type.UNFINISHED_DIALOG:
                default:
            }
        };

        try {
            dialog.selectStepByLabel('Start');

            nextStep();
        } catch (e) {
            chatter.showErrorMessage(e.message);
            //error Message
            console.error(e);
        }
    }
    return chatter;

}));