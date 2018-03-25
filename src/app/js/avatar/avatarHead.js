import Vue from "vue";
import _ from 'lodash';

const HEAD_SHAPE = [
    {
        d : "m 40,120 c -7.69258,-2.85806 -16.05447,-8.16178 -21.87077,-18.85411 -5.81631,-10.69234 -5.69611,-10.05706 -7.28037,-19.17972 -1.69222,-7.45349 -15.86377,-14.55774 -2.73107,-24.30382 1.60206,-1.71636 1.29008,-21.82442 12.0528,-31.80686 10.76272,-9.98244 28.05446,-10.84942 34.12537,-11.33299 6.07091,0.48357 23.36265,1.35055 34.12537,11.33299 10.76272,9.98244 10.45074,30.0905 12.0528,31.80686 13.1327,9.74608 -1.03885,16.85033 -2.73107,24.30382 -1.58426,9.12266 -1.46406,8.48738 -7.28037,19.17972 -5.8163,10.69233 -14.17819,15.99605 -21.87077,18.85411 -7.69259,2.85807 -9.58434,3.30224 -14.29596,3.30224 -4.71162,0 -6.60337,-0.44417 -14.29596,-3.30224 z"
    }
];

export default Vue.component('avatar-head', {
    template: `<g>
       <path
       style="fill:#ffd4c6;fill-rule:evenodd;stroke:#000000;stroke-width:6;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;fill-opacity:1"
       :d="d"/>
</g>`,
    props: [
        'model'
    ],
    computed : {
        d: function(){
            const shape = HEAD_SHAPE[_.get(this,'model.head')];
            if(shape)
                return shape.d
            return HEAD_SHAPE[0].d;
        }
    }
});