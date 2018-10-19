import Vue from "vue";

export default Vue.component('userSettings', {
    template: `<div v-bind="{user}">
                        <hr/>
                        <div class="columns">
                            <div class="column col-3">
                                <img class="roundIcon" :src="user.url" width="50">
                            </div>
                            <div class="column col-9">
                                
                                <label class="form-label" for="input-entry-id">Character</label>
                                <input class="form-input" type="text" id="charName0" placeholder="" v-model="user.name">
                                
                                <label class="form-label" for="input-example-1">Name</label>
                                <input ref="file-input" class="form-input" type="file" id="" @change="fileChanged" placeholder="Name">
                                <progress class="progress" :value="this.fileCurrent" :max="this.fileMax"></progress>
                                <!--<button class="btn btn-lg" @click="uploadFile">Upload</button>-->
                                
                                <label class="form-label" for="input-entry-id">Url</label>
                                <input class="form-input" type="text" id="charImage0" placeholder="" v-model="user.url">
                            </div>
                        </div>
               </div>`,
    props: ['user', 'index' ],
    data: () => {
        return {
            fileMax: 100,
            fileCurrent: 0
        }
    },
    methods: {
        fileChanged() {
            console.log("filechanged");
            const files = this.$refs['file-input'].files;
            if (files.length > 0) {
                const reader = new FileReader();
                this.fileMax =  100;
                this.fileCurrent= 0;

                reader.onprogress = (event) => {
                    this.fileMax = event.total;
                    this.fileCurrent = event.loaded;
                };

                reader.onloadend = () => {
                    this.user.url = reader.result;
                };
                reader.readAsDataURL(files[0]);
            }
        },

        uploadFile() {

        }
    }
});