import Vue from "vue";
import './avatarBody.js';
import './avatarEyes.js';
import './avatarHair.js';
import './avatarHead.js';
import './avatarMouth.js';
import './avatarNose.js';


export default Vue.component('avatar', {
    template: `<svg width="140" height="140">
                    <avatar-body></avatar-body>
                    <avatar-head></avatar-head>
                    <avatar-eyes></avatar-eyes>
                    <avatar-nose></avatar-nose>
                    <avatar-mouth></avatar-mouth>
                    <avatar-hair></avatar-hair>
                </svg>`,
    props: [
        'model'
    ]
});