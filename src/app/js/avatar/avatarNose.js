import Vue from "vue";


export default Vue.component('avatar-nose', {
    template: `<g>
                <path
       style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3.16749215;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
       d="m 58,73 c 0,0 4.39484,6.21363 3.73292,8.79904 -0.66192,2.5854 -5.0661,3.99956 -5.0661,3.99956"
       />

</g>`,
    props: [
        'model'
    ]
});