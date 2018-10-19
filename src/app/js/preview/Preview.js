import Vue from "vue";
import RefreshIcon from "../../../common/assets/refresh.svg";

export default new Vue({
    el: '#preview',
    template:
        `<div class="modal chat-modal" v-bind:class="{active: active}" id="preview">
            <a href="" class="modal-overlay" aria-label="Close"></a>
            <div class="modal-container">
                <div class="modal-header">
                    <a @click="closePreview()" class="btn btn-clear float-right" aria-label="Close"></a>
                    <div class="modal-title h5">Preview</div>
                </div>
                <div class="modal-body">  
                    <div class="content columns">
                        <div class="form-group column col-9">                 
                            <div class="iframe-wrapper">
                                <iframe ref="iframe" width="1080" height="1920" :src="iframeSrc"></iframe>
                            </div>
                        </div>
                        <div class="form-group column col-3">   
                            <button class="btn btn-action btn-primary s-circle btn-lg refresh" v-html="RefreshIcon" @click="refresh"></button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                
                </div>
            </div>
        </div>`,
    data: {
        RefreshIcon,
        active: false,
        iframeSrc: "data:text/html;charset=utf-8,"
    },
    methods: {
        closePreview() {
            this.active = false;
        },
        showPreview(dataUrl) {
            this.iframeSrc = dataUrl;
            this.active = true;
        },
        refresh() {
            console.log("refresh"); //Does
            const src = this.iframeSrc;
            this.iframeSrc = '';
            setTimeout(()=>{this.iframeSrc = src;}, 0);
            /*
            this.$refs["iframe"].src = 'about:blank';
            this.$refs["iframe"].src = src;
            this.$refs["iframe"].contentWindow.location.reload(true);
            */
        }
    }
});