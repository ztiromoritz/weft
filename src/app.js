import './css/styles.css';
import Snap from 'snapsvg-cjs';
import _ from 'lodash';
const s = Snap("#graph");


const grid = {
    rows: 5,
    cols: 3,
    height: 40,
    width: 40
};

function debugGrid(grid){
    _.range(grid.rows)
        .map((x)=>
}

debugGrid(grid);

const squares = [s.rect(210, 40, 40, 40), s.rect(140, 40, 40, 40)];
squares.forEach(square => {
        square.attr({
            fill: 'lightblue',
            stroke: 'lightblue',
            strokeOpacity: .3,
            strokeWidth: 10
        });
        square.drag();
    }
);




