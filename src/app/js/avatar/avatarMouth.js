import Vue from "vue";


export default Vue.component('avatar-mouth', {
    template: `<g>
        <path style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3.16749215;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
             d="m 40,95  c 0,0 8.16008,5.10232 13.33188,5.33274 5.17179,0.23043 15.99825,-4.79947 15.99825,-4.79947"/>
       
        <path
            d="m 47,104 c 0,0 2.02742,1.36939 7.19922,1.59982 5.17179,0.23042 6.3993,-0.79991 6.3993,-0.79991"
            style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3.16749215;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
        </g>`,
    props: [
        'model'
    ]
});