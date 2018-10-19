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
        root['speech'] = factory();
    }
}(this, function () {
    'use strict';

    var speech = {};


    var voices = window.speechSynthesis.getVoices();
    var settings = {
        voice: voices[10],
        voiceURI: 'native',
        volume: 1,
        rate: 1,
        pitch: 1,
        lang: "en-US"
    };

    speech.say = function (message) {
        var msg = new SpeechSynthesisUtterance();
        Object.assign(msg, settings);
        msg.text = message;
        speechSynthesis.speak(msg);

    };

    return speech;
}));