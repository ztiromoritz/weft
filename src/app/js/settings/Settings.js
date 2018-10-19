import Vue from "vue";
import '../avatar/avatar.js';
import './UserSettings.js';
import {EventBus, Events} from '../EventBus.js';

export default new Vue({
    el: '#settings',
    template:
        `<div   class="modal chat-modal" v-bind:class="{active: active}" id="settings">
            <a href="" class="modal-overlay" aria-label="Close"></a>
            <div class="modal-container">
                <div class="modal-header">
                    <a @click="closeSettings()" class="btn btn-clear float-right" aria-label="Close"></a>
                    <div class="modal-title h5">Settings</div>
                </div>
                <div class="modal-body">
                    <div id="editor-form-column" class="form-group column col-12">
                        <label class="form-label" for="input-entry-id">StoryTitle</label>
                        <input class="form-input" type="text" id="input-story-title" placeholder="" v-model="storyTitle">
                        
                        <label class="form-label" for="input-entry-id">StoryAuthor</label>
                        <input class="form-input" type="text" id="input-story-author" placeholder="" v-model="storyAuthor">
                        
                        <label class="form-switch">
                            <input type="checkbox" v-model="groupChat">
                            <i class="form-icon"></i> Group Chat
                        </label>
                        
                        
                        <h3>Characters</h3>
                       

                        <button @click="add" class="btn btn-action"><i class="icon icon-plus"></i></button>
                        <button @click="remove" class="btn btn-action"><i class="icon icon-minus"></i></button>
                       
                        <userSettings v-for="(user, index) in users" :key="index" :user="user" :index="index"></userSettings>
                        
             
                     
                        
                    </div>
                </div>
                <div class="modal-footer"></div>
            </div>
        </div>`,
    data : {
        active : false,
        storyTitle : "",
        storyAuthor : "",
        groupChat : false,
        model : {
            head: {shape: 0}
        },
        closeResolve: null,
        users : []
    },
    created(){
        EventBus.$on(Events.ESC_PRESSED, ()=>{
            if(this.active){
                this.closeSettings();
            }
        })
    },
    methods: {
        closeSettings() {
            this.active = false;
            this.closeResolve({
                users : this.users,
                storyTitle : this.storyAuthor,
                storyAuthor : this.storyAuthor
            });
        },
        showSettings({users, storyTitle, storyAuthor}) {
            return new Promise((resolve)=>{
                this.users = users || [];
                this.storyTitle = storyTitle || "Enter title here";
                this.storyAuthor = storyAuthor || "Enter autor here";
                this.active = true;
                this.closeResolve = resolve;
            });
        },
        remove(){

        },
        add() {
            console.log('add', this.users);
            this.users.push(
                {
                    name: 'user_' + this.users.length,
                    url: '',
                    filename : ''
                });
        }
    }
});