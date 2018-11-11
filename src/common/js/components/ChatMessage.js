import Vue from "vue";
import chatter_util from "../utils/ColorUtil.js";

export default Vue.component('chat-message', {
    template: `<div class="message-wrapper"  v-bind:class="{me: (user === 'me'), other: !(user === 'me')}">
                    <img  v-if="!(user === 'me') && !!(userImage)" class="user" :src="userImage">  
                    <div  v-if="!(user === 'me') && !userImage" class="user letter" :style="backgroundStyle">{{letter}}</div>
                    <div class="message">
                        <div v-if="!typing" class="content" v-html="content"></div>
                        <div v-else         class="content typing"><span></span><span></span><span></span></div>
                    </div>
               </div>`,
    props: {
        'user': {default: 'me', type: String},
        'content': {default: '', type: String},
        'typing': {default: false, type: Boolean},
        'users': null // TODO ? Type
    }
    ,
    computed: {
        userImage: function () {
            console.log("userImage USERS",this.users);

            let url = null;
            this.users.forEach((user)=> {
                console.log(user.name,this.user);
                if (user.name === this.user) {
                    url = user.url;
                }
            });
            return url;
        },
        backgroundStyle: function () {
            const bg = chatter_util.stringToColour(this.user);
            const color = chatter_util.invertColor(bg);
            return 'background-color: ' + bg + '; color: ' + color + ';';
        },
        letter: function () {
            return this.user[0].toUpperCase();
        }
    }
});