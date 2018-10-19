import Snap from '../snap/SnapMod.js';
import _ from 'lodash';
import {EventBus, Events} from '../EventBus.js';

var gridSize = 50;


//Internal Event Handler:
// * They Handle the recalculation and redraw
// * Then they call the UIs handler that create DOM Events in the svgRoot element
const start = function (ui) {

    const startDragElement = (element)=>{
        const _x = element.attr("x");
        const _y = element.attr("y");
        element.data("ox", _x);
        element.data("oy", _y);
        const label = element.data("label");
        label.style.left = `${_x}px`;
        label.style.top = `${_y}px`;
    };


    return function (e) {
        startDragElement(this);
        _.values(ui.squares).forEach((square)=>{
            if(square.element.hasClass('selected')){
                startDragElement(square.element);
            }
        });
        if (ui.onDragStart) {
            ui.onDragStart(this, e);
        }
    };
};

const move = function (ui) {

    const adjustConnections = () => {
        ui.connections.forEach(con => ui.snap.connection(con));
    };

    const moveElement = (element,dx,dy)=>{
        const _x = parseInt(element.data("ox")) + dx;
        const _y = parseInt(element.data("oy")) + dy;
        element.attr({
            x: _x,
            y: _y
        });
        const label = element.data("label");
        label.style.left = `${_x}px`;
        label.style.top = `${_y}px`;
    };


    return function (dx, dy) {
        moveElement(this,dx,dy)
        _.values(ui.squares).forEach((square)=>{
            if(square.element.hasClass('selected')){
                moveElement(square.element,dx,dy);
            }
        });
        adjustConnections();
    }
};

const stop = function (ui) {

    return function (e) {
        if (ui.onDragStop) {
            ui.onDragStop(this, e);
        }
    };
};


const dblClick = function (ui) {
    return function (e) {
        if (ui.onDblClick) {
            ui.onDblClick(this, e);
        }
    };
};

const click = function (ui) {
    return function (e) {
        if (ui.onClick) {
            ui.onClick(this, e);
        }
    };
};


const CONNECTION_CONF = {
    directed: true,
    straight: true
};

const SQUARE_SIZE = 80;

class GraphUI {

    constructor(svgRoot, parentDiv) {
        this.parentDiv = parentDiv;
        this.svgRoot = svgRoot;
        this.snap = Snap(svgRoot);
        this.squares = Object.create({});
        this.connections = [];
        this._start = start(this);
        this._move = move(this);
        this._stop = stop(this);
        this._dblClick = dblClick(this);
        this._click = click(this);

        this._initSelectionFrame();
    }


    _initSelectionFrame() {

        const getOffset = () => {
            var rect = this.svgRoot.getBoundingClientRect();
            var scrollTop = window.scrollY
                || window.pageYOffset
                || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
            var scrollLeft = window.scrollX
                || window.pageXOffset
                || document.body.scrollLeft + (document.documentElement && document.documentElement.scrollLeft || 0);
            return {
                offsetX: -(rect.left + scrollLeft),
                offsetY: -(rect.top + scrollTop)
            };
        };

        this.svgRoot.addEventListener('mousedown', (e) => {
            if (e.srcElement === this.svgRoot) {
                document.body.style.cursor = 'crosshair';

                const {offsetX, offsetY} = getOffset();
                const x_0 = e.pageX + offsetX;
                const y_0 = e.pageY + offsetY;
                const frame = this.snap.rect(x_0, y_0, 0, 0);
                frame.addClass('selector-frame');

                const onMouseMove = (e) => {
                    const x_1 = e.pageX + offsetX;
                    const y_1 = e.pageY + offsetY;
                    frame.attr('x', Math.min(x_0, x_1));
                    frame.attr('y', Math.min(y_0, y_1));
                    frame.attr('width', Math.abs(x_0 - x_1));
                    frame.attr('height', Math.abs(y_0 - y_1));
                };

                const onMouseUp = (e) => {
                    const x_1 = e.pageX + offsetX;
                    const y_1 = e.pageY + offsetY;
                    this._selectElements({x_0,y_0}, {x_1,y_1});
                    frame.remove();
                    this.svgRoot.removeEventListener('mousemove', onMouseMove);
                    this.svgRoot.removeEventListener('mouseup', onMouseUp);
                    document.body.style.cursor = '';
                };

                this.svgRoot.addEventListener('mousemove', onMouseMove);
                this.svgRoot.addEventListener('mouseup', onMouseUp);

                if (e.srcElement === this.svgRoot) {
                    this.onOuterClick();
                }
            }
        });
    }

    _createElement(square) {


        const label = document.createElement('div');
        label.classList.add('text-box');
        label.innerHTML = `<span>${square.id}</span>`;
        label.style.left = `${square.pos.x}px`;
        label.style.top = `${square.pos.y}px`;
        this.parentDiv.appendChild(label);

        const element = this.snap.rect(square.pos.x, square.pos.y, SQUARE_SIZE, SQUARE_SIZE);
        if(square.id === 'Start')
            element.addClass('start');
        element.addClass('passage');
        element.data('entryId', square.id);
        element.data('label', label);
        element.drag(this._move, this._start, this._stop);
        element.dblclick(this._dblClick);
        element.click(this._click);
        return element;
    }

    onDragStart(element) {
        this._selectSingleElement(element);
    };

    onDragStop(element) {
        const detail = {
            id: element.data('entryId'),
            x: element.attr('x'),
            y: element.attr('y')
        };
        EventBus.$emit(Events.ENTRY_MOVED, detail);
    };

    onClick(element) {
        this._selectSingleElement(element);
    }

    getSelectedIds(){
        return _.values(this.squares)
            .filter(square=>square.element.hasClass('selected'))
            .map(square=>{console.log("e",square);return square.element.data('entryId')});
    }

    _selectionChanged(){
        const selected = this.getSelectedIds();
        EventBus.$emit(Events.SELECTION_CHANGED, {selected});
    }

    _selectSingleElement(element) {
        const clickedId = element.data('entryId');
        console.log('inner', clickedId);
        if (!element.hasClass('selected')) {
            element.addClass('selected');
            _.values(this.squares).forEach((square) => {
                if (square.element.data('entryId') !== clickedId) {
                    square.element.removeClass('selected');
                }
            });
            this._selectionChanged();
        }
    }

    _selectElements({x_0, y_0}, {x_1, y_1}) {
        const between = (test, bound_0, bound_1) => {
            const max = Math.max(bound_0, bound_1);
            const min = Math.min(bound_0, bound_1);
            return (min <= test && test <= max);
        };

        _.values(this.squares).forEach((square) => {
            const x = Number.parseFloat(square.element.attr('x'));
            const y = Number.parseFloat(square.element.attr('y'));
            if(between(x,x_0,x_1) && between(y,y_0,y_1)){
                square.element.addClass('selected');
            }else{
                square.element.removeClass('selected');
            }
        });
        this._selectionChanged();
    };

    onOuterClick() {
        _.values(this.squares).forEach((square) => {
            square.element.removeClass('selected');
        });
        this._selectionChanged();
    }

    onDblClick(element) {
        EventBus.$emit(Events.OPEN_EDITOR, {
            id: element.data('entryId'),
        });
    };


    clearConnections() {
        this.connections.forEach((connection) => {
            connection.line.remove();
            connection.bg.remove();
        });
        this.connections = [];
    }

    recalculateConnections() {
        this.clearConnections();
        _.values(this.squares).forEach((square) => {
            const parentSquare = this.squares[square.id];
            square.children.forEach((child) => {
                const childSquare = this.squares[child];
                if (childSquare) {
                    const items = this.snap.connection(parentSquare.element, childSquare.element, "blue", "grey", CONNECTION_CONF);
                    this.connections.push(items);
                }
            });
        })
    }

    updateEntry(entry, oldId) {
        // remove old entry
        const toRemove = (typeof oldId !== 'undefined') ? oldId : entry.id;
        this.removeEntry(toRemove);

        // add new entry
        this.squares[entry.id] = this.createSquare(entry);
    }

    removeEntry(entryId){
        const square = this.squares[entryId];
        if (square) {
            const label = square.element.data('label');
            label.remove();
            square.element.remove();
        }
        delete this.squares[entryId]
    }

    createSquare(entry) {
        return {
            id: entry.id,
            element: this._createElement(entry),
            children: entry.children
        };
    }

    /**
     *
     * @param {{id,pos,data,children}} entries
     */
    addEntries(entries) {
        this.clearConnections();
        entries.forEach((entry) => {
            this.squares[entry.id] = this.createSquare(entry);
        });
        this.recalculateConnections();

    }

    getFreePosition() {
        let x = 0;
        let y = 0;
        _.values(this.squares).forEach(square => {
            const element = square.element;
            x = Math.max(x, Number.parseFloat(element.attr('x')));
            y = Math.max(y, Number.parseFloat(element.attr('y')));
        });
        x = x + SQUARE_SIZE + 10;
        return {x, y};
    }


}


export default GraphUI;