import Vue from "vue";


export default Vue.component('chat-option', {
    template: `
                    <div>{{content}}</div>
                </div>`,
    props: [
        'content',
        'link'
    ]
});

// TODO: link handling -> onClick createAndJump