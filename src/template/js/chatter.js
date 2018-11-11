import bubble from '../lib/bubble.js';
import {addClass, removeClass} from 'Common/utils/DomUtils.js';
import ChatMessage from 'Components/ChatMessage.js';

const chatter = {};
export default chatter;

const $chat = document.querySelector("#chat");
const $answerInput = document.getElementById('answerInput');
const $answerButton = document.getElementById('answerButton');
const $options = document.querySelector(".options");

/**
 * @param $element
 * @param options
 * @param nextCallback
 */
function renderOptions($element, options) {
    return new Promise((resolve) => {
        let clicked = false;
        options.map((option) => {
                var $option = document.createElement('div');
                $option.innerHTML = option.getContent();
                $option.addEventListener('click', ()=> {
                    if (!clicked) {
                        clicked = true;
                        resolve(option.getLabel());
                    }
                });
                return $option;
            }).forEach(function ($option) {
                $element.appendChild($option);
            });
        addClass($element, 'show');
        removeClass($options, 'hide');
    });
}

/**
 * @returns {Promise<HTMLElement>}
 */
function hideOptions() {
    return new Promise(function (resolve) {
        addClass($options, 'hide');
        removeClass($options, 'show');
        var onTransitioned = function () {
            $options.innerHTML = "";
            $options.removeEventListener("transitionend", onTransitioned);
            resolve($options);
        };
        $options.addEventListener("transitionend", onTransitioned);
    });
}

        /**
 * @returns {Promise<HTMLElement>}
 */
chatter.showOptions = function (options) {
    return renderOptions($options, options)
        .then((selectedLabel) => {
            hideOptions();
            return selectedLabel;
        })
};




function meTypeMessage(msg){
    var $answer = document.createElement('span');
    $answer.innerHTML = msg.content;
    var handler = bubble($answer, {grow: true});
    $answerInput.appendChild($answer);

    return handler.start(30);
}

function waitForSubmit(){
    return new Promise(resolve=>{
        var submitMessage = function () {
            removeClass($answerButton, 'glow');
            $answerButton.removeEventListener('click', submitMessage);
            $chat.appendChild($message);
            $answer.innerHTML = "";
            resolve()
        };
        addClass($answerButton, 'glow');
        $answerButton.addEventListener('click', submitMessage);
    });
}


/**
 *
 * @param {{content, user, typing}, users} msg
 * @param {Function} [done]
 */
chatter.addMessage = function (msg, users) {

    return new Promise(function (resolve, reject) {

        const messageView = new ChatMessage({
            propsData: {
                users,
                user: msg.user,
                typing: true
            }
        });
        const $message = messageView.$mount().$el;

        $chat.scrollTop = $chat.scrollHeight;

        var writeTyping = function () {
            return new Promise(function (resolve) {
                if (msg.user.toLowerCase() === 'me') {
                    meTypeMessage(msg)
                        .then(waitForSubmit)
                        .then(resolve);
                } else {
                    $chat.appendChild($message);
                    setTimeout(resolve, msg.typing);
                }
            });
        };
        var writeMessage = function () {
            messageView.$props.content = msg.content;
            messageView.$props.typing = false;
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



