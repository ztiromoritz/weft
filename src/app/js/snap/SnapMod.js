import Snap from 'snapsvg-cjs';

//Add Some Plugins to SNAP

//Source code from Dmitry at http://raphaeljs.com/graffle.html
Snap.plugin(function (Snap, Element, Paper, global) {

    Paper.prototype.connection = function (obj1, obj2, line, bg, options) {
        options = options || {};

        //first argument is the created connection itself
        //other arguements will be ignored then.
        if (obj1.line && obj1.from && obj1.to) {
            line = obj1;
            obj1 = line.from;
            obj2 = line.to;
            options = line.options;
        }

        var bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox(),
            p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
                {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
                {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
                {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
                {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
                {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
                {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
                {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
            d = {}, dis = [];


        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }
        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }
        var x1 = p[res[0]].x,
            y1 = p[res[0]].y,
            x4 = p[res[1]].x,
            y4 = p[res[1]].y;
        dx = Math.max(Math.abs(x1 - x4) / 2, 10);
        dy = Math.max(Math.abs(y1 - y4) / 2, 10);
        var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
        var path;
        if (options.straight) {
            path = "M" + [x1.toFixed(3), y1.toFixed(3)].join() + "L" + [x4.toFixed(3), y4.toFixed(3)].join();
        } else {
            console.log("CCC");
            path = "M" + x1.toFixed(3) + "," + y1.toFixed(3) + "C" + [x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join();
        }

        if (line && line.line) {
            line.bg && line.bg.attr({path: path});
            line.line.attr({path: path});
        } else {
            var color = typeof line == "string" ? line : "yellow";
            var attr = {stroke: color, fill: "none"};
            if (options.directed) {
                var arrowPath = this.path("M 2 59 L 293 148 L 1 243 L 121 151 Z").attr({
                    fill: color,
                    stroke: color,
                    strokeWidth: 5
                });
                var arrowMarker = arrowPath.marker(0, 0, 8000, 8000, 250, 150).attr({
                    markerUnits: 'strokeWidth',
                    markerWidth: 300,
                    markerHeight: 300,
                    orient: "auto"
                });

                attr['markerEnd'] = arrowMarker;
            }
            return {
                bg: bg && bg.split && this.path(path).attr({
                    stroke: bg.split("|")[0],
                    fill: "none",
                    "stroke-width": bg.split("|")[1] || 3
                }),
                line: this.path(path).attr(attr),
                from: obj1,
                to: obj2,
                options : options
            };
        }
    }

});


export default Snap;