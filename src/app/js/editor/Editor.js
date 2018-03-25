import Vue from 'vue';
import './ChatEditor.js';
import Events from '../Events.js';
import Util from '../Util.js';


export default new Vue({
    el: '#editor',
    template: `<div class="modal chat-modal" v-bind:class="{active: active}" id="editor">
    <a href="" class="modal-overlay" aria-label="Close"></a>
    <div class="modal-container">
        <div class="modal-header">
            <a  @click="closeEditor()" class="btn btn-clear float-right" aria-label="Close"></a>
            <div class="modal-title h5">Passage</div>
        </div>
        <div class="modal-body">
            <div class="content columns editor-columns">
                <div id="editor-form-column" class="form-group column col-6">
                  <label class="form-label" for="input-entry-id">Id</label>
                  <input class="form-input" type="text" id="input-entry-id" placeholder="" v-model="entryId">
    
                  <label class="form-label" for="input-content">Content</label>
                  <textarea class="form-input" id="input-content" placeholder="" v-model="content" @input="textChanged"></textarea> 
                </div>
                
                <div id="editor-chat-column" class="column col-6">
                    <chat-editor :messages="messages" :options="options" :users="users"></chat-editor>
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
        options: [],
        users: {}
    },
    methods: {
        closeEditor() {
            this.updateData();
            if (this.$eventTarget) {
                //TODO how to do it better
                //console.log(this.content,this.entryId,this.messages);
                const detail = {
                    id: this.entryId,
                    originalId : this.originalId,
                    content: this.content,
                    messages: this.messages,
                    options: JSON.parse(JSON.stringify(this.options))
                };
                this.$eventTarget.dispatchEvent(new CustomEvent(Events.CHATTER_ENTRY_CHANGED, {detail}))
            }
            this.active = false;
        },
        showEditor({id, data, children},users, $eventTarget) {
            this.$eventTarget = $eventTarget;
            this.entryId = id;
            this.originalId = id;
            this.content = data.content;
            this.users = users || {};
            console.log("USERS",users);
            this.updateData();
            this.active = true;
        },
        textChanged(e) {
            this.updateData();
            console.log(this.options);
        },
        updateData(){
            this.messages = Util.parseMessages(this.content);
            this.options = Util.parseOptions(this.content);
        }

    },
    created() {

    }
});