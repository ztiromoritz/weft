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
        root['ChatterMessage'] = factory();
    }
}(this, function () {

    /**
     * Defines a macro
     * <<msg "username" "content" ["delay"]>>
     *
     * Example:
     *  <<msg "me" "Hello" "1s">>
     *
     * formaly
     * <<username "content">>
     */


    var stringToColour = function(str){
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    };

    var invertColor = function(hex) {
        function padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }


        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        // invert color components
        var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
        // pad each with zeros and return
        return '#' + padZero(r) + padZero(g) + padZero(b);
    };


    var generatedAvatarStyle = funciton(user){
        var bg = stringToColour(options.user);
        var color = invertColor(bg);
        return 'background-color: ' + bg + '; color: ' + color + ';';
    }

    var getIcon = function(user){
        if(user !== 'me'){
            return '';
        }
        var imageUrl = this.userMap[user];x

    };


    var getWrapperClasses = function(user){
        if(user === 'me'){
            return 'message-wrapper me';
        }
        return 'message-wrapper other'
    };


    /**
     *
     * @param users
     * @constructor
     */
    const ChatterMessage = function(users){
        this.userMap = Object.create({});
        for (var i = 0;i<users.length; i++){
            var user = users[i];
            this.userMap[user.name] = user;
        }
    };

    /**
     * Methode to render node in weft editors preview
     * @param {{user,content}} options
     * @return {String}
     */
    ChatterMessage.prototype.preview = function(context){

    };

    /**
     * Message to render node in weft template.
     * @param {{user,content}} options
     * @return Promise - resolves
     */
    ChatterMessage.prototype.animate = function(context){

    };

    return ChatterMessage;

}));