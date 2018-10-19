import Vue from "vue";
import AddIcon from "../../../common/assets/plus.svg";
import DownloadIcon from "../../../common/assets/download.svg";
import PlayIcon from "../../../common/assets/play.svg";
import SettingsIcon from "../../../common/assets/sliders.svg";
import DeleteIcon from "../../../common/assets/trash.svg";
import UploadIcon from "../../../common/assets/upload.svg";
import MediaIcon from "../../../common/assets/file-image-o.svg";
import {EventBus, Events} from '../EventBus.js';

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
        deleteEnabled: false
    },
    created() {
        EventBus.$on(Events.SELECTION_CHANGED, ({selected}) => {
            this.deleteEnabled = selected && (selected.length>0);
        });
    },
    methods: {
        add() {
            EventBus.$emit(Events.ADD_NODE);
        },
        play() {
            EventBus.$emit(Events.PLAY);
        },
        exportStory() {
            EventBus.$emit(Events.EXPORT);
        },
        settings() {
            EventBus.$emit(Events.SETTINGS);
        },
        upload() {
            EventBus.$emit(Events.UPLOAD);
        },
        deleteSelected() {
            console.log("deleteSelected");
            EventBus.$emit(Events.DELETE_SELECTED);
        }
    }
});



