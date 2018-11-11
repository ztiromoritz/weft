import Vue from "vue";
const chatter_util = weft_common.ColorUtil;


export default Vue.component('chat-message', {
    template: `<div class="message-wrapper"  v-bind:class="{me: (user === 'me'), other: !(user === 'me')}">
                    <img  v-if="!(user === 'me') && !!(userImage)" class="user" :src="userImage">  
                    <div  v-if="!(user === 'me') && !userImage" class="user letter" :style="backgroundStyle">{{letter}}</div>
                    <div class="message">  
                        <div class="content" v-html="content"></div>
                    </div>
               </div>`,
    props: [
        'user',
        'content',
        'users'
    ],
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