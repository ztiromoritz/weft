import Vue from "vue";
import Events from "../Events.js";
import AddIcon from "../../../common/assets/plus.svg";
import DownloadIcon from "../../../common/assets/download.svg";
import PlayIcon from "../../../common/assets/play.svg";
import SettingsIcon from "../../../common/assets/sliders.svg";
import DeleteIcon from "../../../common/assets/trash.svg";
import UploadIcon from "../../../common/assets/upload.svg";
import MediaIcon from "../../../common/assets/file-image-o.svg";


export default new Vue({
    el: '#menu',
    template: `
            <menu id="menu">
           
            <button class="btn btn-action btn-primary s-circle btn-lg play" v-html="PlayIcon" @click="play"></button>
            <button class="btn btn-action btn-primary s-circle btn-lg download" v-html="DownloadIcon" @click="exportStory"></button>
            <button class="btn btn-action btn-primary s-circle btn-lg upload" v-html="UploadIcon" @click="upload"></button>
            <!--<button class="btn btn-action btn-primary s-circle btn-lg upload" v-html="MediaIcon" @click="media"></button>-->
            <button class="btn btn-action btn-primary s-circle btn-lg settings" v-html="SettingsIcon" @click="settings"></button>
             <button class="btn btn-action btn-primary s-circle btn-lg add" v-html="AddIcon" @click="add"></button>
             <button class="btn btn-action btn-primary s-circle btn-lg delete" :disabled="!deleteEnabled" v-html="DeleteIcon" @click="deleteSelected"></button>
            </menu>
        `,
    data: {
        PlayIcon,
        DownloadIcon,
        SettingsIcon,
        AddIcon,
        DeleteIcon,
        UploadIcon,
        MediaIcon,
        deleteEnabled : false,
        eventTarget: null},
    methods: {
        sendEvent(eventType) {
            if (this.eventTarget) {
                this.eventTarget.dispatchEvent(new CustomEvent(eventType));
            }
        },
        setEventTarget(eventTarget){
            this.eventTarget = eventTarget;
            this.eventTarget.addEventListener(Events.CHATTER_SELECTION_CHANGED, (e)=>{
                console.log(e.detail.selected);
                this.deleteEnabled = e.detail.selected && (e.detail.selected.length>0);
            });
        },
        add() {
            this.sendEvent(Events.CHATTER_ADD);
        },
        play() {
            this.sendEvent(Events.CHATTER_PLAY);
        },
        exportStory() {
            this.sendEvent(Events.CHATTER_EXPORT);
        },
        settings() {
            this.sendEvent(Events.CHATTER_SETTINGS);
        },
        upload() {
            this.sendEvent(Events.CHATTER_UPLOAD);
        },
        deleteSelected() {
            console.log("deleteSelected");
            this.sendEvent(Events.CHATTER_DELETE_SELECTED);
        }
    }
});



