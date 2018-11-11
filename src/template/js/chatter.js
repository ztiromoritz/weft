
import bubble from '../lib/bubble.js';
import {addClass, removeClass} from '../../common/js/utils/DomUtils.js';
'use strict';
var chatter = {};
export default chatter;
var $chat = document.querySelector("#chat");


/**
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
            //speech.say(msg.content.replace(/(<([^>]+)>)/ig, ""));
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



