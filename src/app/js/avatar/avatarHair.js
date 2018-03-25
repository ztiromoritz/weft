import Vue from "vue";


export default Vue.component('avatar-hair', {
    template: `<g>
                  <path
       style="fill:#f68585;fill-opacity:1;fill-rule:evenodd;stroke:#c96b6b;stroke-width:5.33194542;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                        d="m 47,8 -29.06349,6.93257 -13.59852,25.06393 22.39756,-14.13179 17.86471,-5.06611 -10.6655,17.33143 23.19746,-17.59808 -9.59895,21.86429 25.86385,-20.79773 -10.13223,33.06305 21.86427,-18.66462 3.46629,20.53109 12.7986,-12.53196 9.06567,12.53196 -10.93214,-25.59721 -15.19833,-19.1979 -28.53021,-5.59939 z"
                    />          

               </g>`,
    props: [
        'model'
    ]
});