import Vue from "vue";


export default Vue.component('chat-message', {
    template: `<div class="message" v-bind:class="{me: (user === 'me'), other: user === 'other'}">
                    <div class="user"></div>
                    <div class="content">{{content}}</div>
                </div>`,
    props: [
        'user',
        'content'
    ]
});