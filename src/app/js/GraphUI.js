import Snap from './SnapMod.js';
import Events from './Events.js';

var gridSize = 50;


//Internal Event Handler:
// * They Handle the recalculation and redraw
// * Then they call the UIs handler that create DOM Events in the svgRoot element
const start = function (ui) {
    return function () {
        this.data("ox", this.type == "rect" ? this.attr("x") : this.attr("cx"));
        this.data("oy", this.type == "rect" ? this.attr("y") : this.attr("cy"));
        this.data('moveChildren').forEach((child)=>{
            child.data("ox", child.attr("x"));
            child.data("oy", child.attr("y"));
        });
    };
};

const move = function (ui) {

    const adjustConnections = () => {
        ui.connections.forEach(con => ui.snap.connection(con));
    };

    return function (dx, dy) {
        if (this.type === "rect") {
            this.attr({
                x: parseInt(this.data("ox")) + dx,
                y: parseInt(this.data("oy")) + dy
            });

            this.data('moveChildren').forEach((child)=>{
               child.attr({
                   x: parseInt(child.data("ox")) + dx,
                   y: parseInt(child.data("oy")) + dy
               })
            });
        } else {
            this.attr({
                cx: parseInt(this.data("ox")) + dx,
                cy: parseInt(this.data("oy")) + dy
            });
        }

        adjustConnections();
    }
}

const stop = function (ui) {

    return function () {
        if (ui.onDragStop) {
            ui.onDragStop(this);
        }

        /*
        if(this.type === "rect"){
            var bb = this.getBBox();
            var xSnap = Snap.snapTo(gridSize, bb.x, 100000000);
            var ySnap = Snap.snapTo(gridSize, bb.y, 100000000);
            for (var i = connections.length; i--;) {
                s.connection(connections[i]);
            }
            this.attr({
                x: xSnap,
                y: ySnap
            })
        }*/
    };
};


const dblClick = function(ui) {
  return function(){
      if(ui.onDblClick){
          ui.onDblClick(this);
      }
  };
};


const SQUARE_STYLE = {
    fill: 'lightblue',
    stroke: 'black',
    strokeOpacity: .3,
    strokeWidth: 3
};

const TEXT_STYLE = {
    pointerEvents : 'none'
};

const CONNECTION_CONF = {
    directed: true,
    straight: true
};

const SQUARE_SIZE = 50;

class GraphUI {

    constructor(svgRoot) {
        this.svgRoot = svgRoot;
        this.snap = Snap(svgRoot);
        this.squares = Object.create({});
        this.connections = [];
        this._start = start(this);
        this._move = move(this);
        this._stop = stop(this);
        this._dblClick = dblClick(this);
    }

    _createElement(square) {
        console.log("_createElement", typeof square.pos.y );




        const element = this.snap.rect(square.pos.x, square.pos.y, SQUARE_SIZE, SQUARE_SIZE);
        element.attr(SQUARE_STYLE);
        element.data('entryId', square.id);
        const text = this.snap.text(square.pos.x,  Number.parseFloat(square.pos.y) + SQUARE_SIZE/2, square.id);
        text.attr(TEXT_STYLE);
        element.data('moveChildren', [text]);
        element.drag(this._move, this._start, this._stop);
        element.dblclick(this._dblClick);
        return element;
    }

    onDragStop(element) {
        const detail = {
            id: element.data('entryId'),
            x: element.attr('x'),
            y: element.attr('y')
        };
        this.svgRoot.dispatchEvent(new CustomEvent(Events.CHATTER_ENTRY_MOVED, {detail}));
    };

    onDblClick(element){
        const detail = {
            id: element.data('entryId'),
        };
        this.svgRoot.dispatchEvent(new CustomEvent(Events.CHATTER_OPEN_EDITOR, {detail}));
    };

    /**
     *
     * @param {{id,pos,data,children}} entries
     */
    addEntries(entries) {

        entries.forEach((square) => {
            this.squares[square.id] = {
                id: square.id,
                element: this._createElement(square),
                data: square.data,
                children: square.children
            };
        });

        entries.forEach((square) => {
            const parentSquare = this.squares[square.id];
            square.children.forEach((child) => {
                const childSquare = this.squares[child];
                if (childSquare) {
                    console.log("here", childSquare, square);
                    const items = this.snap.connection(parentSquare.element, childSquare.element, "blue", "grey", CONNECTION_CONF);
                    this.connections.push(items);
                }
            });
        })
    }


}


export default GraphUI;