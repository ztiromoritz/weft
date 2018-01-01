import Vue from 'vue';
import './ChatEditor.js';
import Events from './Events.js';


function parseMessages(str) {
    const MESSAGE_REGEX = /<<([^\s]*) "([^"]*)">>/g;
    const messages = [];
    let match;
    while ((match = MESSAGE_REGEX.exec(str)) != null) {
        messages.push({
            user: match[1] === 'MO' ? "me" : "other", content: match[2]
        });
    }
    return messages;
}

function parseOptions(str) {
    //matching [link] and [title|link]
    const OPTION_REGEX = /\[\[([^|\]]*)\|?((?:[^\]]*))\]\]/g;
    const options = [];
    let match;
    while ((match = OPTION_REGEX.exec(str)) != null) {
        console.log("match", match);
        options.push({
            content: match[1],
            link: (match[2].length > 0) ? match[2] : match[1]
        });
    }
    return options;
}


export default new Vue({
    el: '#editor',
    template: `<div class="modal modal-lg chat-modal" v-bind:class="{active: active}" id="modal-id">
    <a href="" class="modal-overlay" aria-label="Close"></a>
    <div class="modal-container">
        <div class="modal-header">
            <a  @click="closeEditor()" class="btn btn-clear float-right" aria-label="Close"></a>
            <div class="modal-title h5">Passage</div>
        </div>
        <div class="modal-body">
            <div class="content columns">
                <div class="form-group column col-6">
                  <label class="form-label" for="input-entry-id">Id</label>
                  <input class="form-input" type="text" id="input-entry-id" placeholder="" v-model="entryId">
    
                  <label class="form-label" for="input-content">Content</label>
                  <textarea class="form-input" id="input-content" placeholder="" rows="24" v-model="content" @input="textChanged"></textarea> 
                </div>
                
                <div class="column col-6">
                    <chat-editor :messages="messages" :options="options"></chat-editor>
                </div> 
            </div>
        </div>
        <div class="modal-footer">
        
        </div>
    </div>
    </div>`,
    data: {
        $eventTarget: null, //  EventTarget-API not Vue Events
        active: false,
        entryId: "",
        content: "",

        messages: [],
        options: []
    },
    methods: {
        closeEditor() {
            this.updateData();
            if (this.$eventTarget) {
                //TODO how to do it better
                console.log(this.content,this.entryId,this.messages);
                const detail = {
                    id: this.entryId,
                    content: this.content,
                    messages: this.messages,
                    options: JSON.parse(JSON.stringify(this.options))
                };
                this.$eventTarget.dispatchEvent(new CustomEvent(Events.CHATTER_ENTRY_CHANGED, {detail}))
            }
            this.active = false;
        },
        showEditor({id, data, children}, $eventTarget) {
            this.$eventTarget = $eventTarget;
            this.entryId = id;
            this.content = data.content;
            this.updateData();
            this.active = true;
        },
        textChanged(e) {
            this.updateData();
            console.log(this.options);
        },
        updateData(){
            this.messages = parseMessages(this.content);
            this.options = parseOptions(this.content);
        }

    },
    created() {

    }
});