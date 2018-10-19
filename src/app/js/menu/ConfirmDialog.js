import Vue from "vue";
import DialogResult from "./DialogResult";
import {EventBus, Events} from "../EventBus";

export default new Vue({
    el: '#confirm',
    template:
        `<div class="modal chat-modal" v-bind:class="{active: active}" id="confirm">
            <a href="" class="modal-overlay" aria-label="Close" ></a>
            <div class="modal-container">
                <div class="modal-header">
                    <a @click="cancel" class="btn btn-clear float-right" aria-label="Close"></a>
                    <div class="modal-title h5">Confirm</div>
                </div>
                <div class="modal-body">
                    {{message}}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="okay">Okay</button>
                    <button class="btn btn-primary" @click="cancel">Cancel</button>
                </div>
            </div>
        </div>`,
    data : {
        active : false,
        message : '',
        resolve : null
    },
    created(){
        EventBus.$on(Events.ESC_PRESSED, ()=>{
            if(this.active){
                this.cancel();
            }
        })
    },
    methods: {
        showDialog(message) {
            console.log('message');
            this.active = true;
            return new Promise((resolve)=>{

                this.message = message;
                this.resolve = resolve;
            });
        },
        cancel(){
            if(this.resolve){
                this.resolve(DialogResult.CANCEL);
                this.resolve = null;
                this.active = false;
            }
        },
        okay(){
            if(this.resolve){
                this.resolve(DialogResult.OKAY);
                this.resolve = null;
                this.active = false;
            }
        }
    }
});