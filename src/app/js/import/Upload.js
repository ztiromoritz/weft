import Vue from "vue";
import '../avatar/avatar.js';
import {EventBus, Events} from '../EventBus.js';

export default new Vue({
    el: '#upload',
    template:
        `<div class="modal chat-modal" v-bind:class="{active: active}" id="upload">
            <a href="" class="modal-overlay" aria-label="Close"></a>
            <div class="modal-container">
                <div class="modal-header">
                    <a @click="closeUpload()" class="btn btn-clear float-right" aria-label="Close"></a>
                    <div class="modal-title h5">Import story</div>
                </div>
                <div class="modal-body">
               
                    <div id="editor-form-column" class="form-group column col-12">
                                    <div class="form-group">
                                        <label class="form-label" for="input-example-1">Name</label>
                                        <input ref="file-input" class="form-input" type="file" id="input-example-1" placeholder="Name">
                                    </div>
                                    <button class="btn btn-lg" @click="importHtml">Import HTML</button>
                                  
                    </div>
                </div>
                <div class="modal-footer"></div>
            </div>
        </div>`,
    data: {
        $eventTarget: null, //  EventTarget-API not Vue Events
        active: false,

    },
    created(){
        EventBus.$on(Events.ESC_PRESSED, ()=>{
            if(this.active){
                this.closeUpload();
            }
        })
    },
    methods: {
        closeUpload() {
            this.active = false;
        },
        showUpload() {
            this.active = true;
        },
        importHtml() {
            const files = this.$refs['file-input'].files;
            if (files.length > 0) {
                const reader = new FileReader();
                reader.onloadend = () => {
                   // console.log(reader.result);
                    EventBus.$emit(Events.IMPORT_HTML_STRING, {html: reader.result});
                };
                reader.readAsText(files[0], 'UTF-8');
            }
        }
    }
});