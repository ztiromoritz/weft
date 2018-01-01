import Vue from 'vue';
import './ChatMessage.js';
import './ChatOption.js';
import icon from '../../common/assets/paper-plane.svg';


export default Vue.component('chat-editor', {
    template: `<div class="zoom-wrap">
                <div class="chat chat-editor chat-frame">
                    <header>
                    
                    </header>
                    <main>
                        <chat-message v-for="(message,index) in messages" :content="message.content" :user="message.user" key="index"></chat-message>
                    </main>
                    <div class="options show">
                        <chat-option v-for="(option,index) in options" :content="option.content" :link="options.link" key="index"></chat-option>
                    </div>
                    <footer>
                    
                    </footer>
                </div>
            </div>`,
    props: [
        'messages',
        'options'
    ]
});