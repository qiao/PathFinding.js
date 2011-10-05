window.GridModel = {
    sizeChange: new Notification(this),
    attrChange: new Notification(this),
    startPosChange: new Notification(this),
    endPosChange: new Notification(this),
    currentReset: new Notification(this), 

    init: function() {
        var self = this;

        this._queue = []
        // add hook on the `set' method of PF.Node
        var orig = PF.Node.prototype.set;
        PF.Node.prototype.set = function() {
            orig.apply(this, arguments);
            self._queue.push({
                x: this.x,
                y: this.y,
                attr: arguments[0],
                value: arguments[1],
            });
        };
    },

    getWidth: function() {
        return this._grid.width;
    },
    getHeight: function() {
        return this._grid.height;
    },
    setSize: function(width, height) {
        this._grid = new PF.Grid(width, height);
        this.sizeChange.notify();
    },

    isWalkableAt: function(x, y) {
        return this.getAttributeAt(x, y, 'walkable');
    },
    setWalkableAt: function(x, y, walkable) {
        this.setAttributeAt(x, y, 'walkable', walkable);
    },


    getAttributeAt: function(x, y, attr) {
        return this._grid.getAttributeAt(x, y, attr);
    },
    setAttributeAt: function(x, y, attr, value) {
        this._grid.setAttributeAt(x, y, attr, value);
        this.attrChange.notify({
            x: x,
            y: y,
            attr: attr,
            value: value,
        });
    },


    getStartX: function() {
        return this._startX;
    },
    getStartY: function() {
        return this._startY;
    },
    setStartPos: function(x, y) {
        this._startX = x;
        this._startY = y;
        this.startPosChange.notify();
    },

    getEndX: function() {
        return this._endX;
    },
    getEndY: function() {
        return this._endY;
    },
    setEndPos: function(x, y) {
        this._endX = x;
        this._endY = y;
        this.endPosChange.notify();
    },

    findPath: function(finder) {
        var path, operations;

        path = finder.findPath(
            this._startX, this._startY,
            this._endX, this._endY,
            this._grid
        );
        operations = this._queue;

        return {
            path: path,
            operations: operations,
        };
    },

    resetCurrent: function() {
        var i, j, matrix = [];
        for (i = 0; i < this._grid.height; ++i) {
            matrix.push([]);
            for (j = 0; j < this._grid.width; j++) {
                matrix[i].push(this._grid.isWalkableAt(j, i) ? 0 : 1);
            };
        }
        this._grid = new PF.Grid(this._grid.width, this._grid.height, matrix);

        this.currentReset.notify();
    },
};


window.GridView = {
    // option fields
    nodeSize: 30,
    normalNodeAttr: {
        fill: 'white',
        'stroke-opacity': 0.2,
    },
    blockNodeAttr: {
        fill: 'grey',
        'stroke-opacity': 0.2,
    },
    startNodeAttr: {
        fill: '#0d0',
        'stroke-opacity': 0.2,
    },
    endNodeAttr: {
        fill: '#e40',
        'stroke-opacity': 0.2,
    },
    openedNodeAttr: {
        fill: '#98fb98',
        'stroke-opacity': 0.2,
    },
    closedNodeAttr: {
        fill: '#afeeee',
        'stroke-opacity': 0.2,
    },
    pathAttr: {
        stroke: 'yellow',
        'stroke-width': 3,
    },
    colorizeDuration: 50,
    zoomEffect: 's1.2',
    zoomDuration: 200,

    // general initialization
    init: function(width, height) {
        this.initPaper();
        this.initListeners();

        this.changedNodes = [];
    },

    
    initListeners: function() {
        var self = this;

        // listeners of model notifications
        GridModel.sizeChange.attach(function() {
            self.setSize(GridModel.getWidth(), GridModel.getHeight());
        });
        GridModel.startPosChange.attach(function() {
            self.setStartPos(GridModel.getStartX(), GridModel.getStartY());
        });
        GridModel.endPosChange.attach(function() {
            self.setEndPos(GridModel.getEndX(), GridModel.getEndY());
        });
        GridModel.attrChange.attach(function(args) {
            self.setAttributeAt(args.x, args.y, args.attr, args.value);
        });
        GridModel.currentReset.attach(function() {
            self.resetCurrent();
        });


        // listeners for browser events
        $('#draw_area').mousedown(function(event) {
            var coord, x, y;
            coord = self.toGridCoordinate(event.pageX, event.pageY);
            x = coord.x; y = coord.y;

            GridController.onMouseDown(x, y);
        });
        $(window).mousemove(function(event) {
            var coord, x, y;
            coord = self.toGridCoordinate(event.pageX, event.pageY);
            x = coord.x; y = coord.y;
            
            GridController.onMouseMove(x, y);
        }).mouseup(function(event) {
            var coord, x, y;
            coord = self.toGridCoordinate(event.pageX, event.pageY);
            x = coord.x; y = coord.y;

            GridController.onMouseUp(x, y);
        });
    },

    // initialize paper
    initPaper: function() {
        this.paper = Raphael('draw_area');
        this.setSize();
    },

    // set paper size
    setSize: function(width, height) {
        var i, j,
            x, y,
            nodeSize = this.nodeSize,
            paper = this.paper,
            rect, 
            rects = [];

        this.paper.setSize(
            nodeSize * width,
            nodeSize * height
        );

        for (i = 0; i < height; ++i) {
            rects[i] = [];

            for (j = 0; j < width; ++j) {
                x = j * nodeSize;
                y = i * nodeSize;


                rect = paper.rect(x, y, nodeSize, nodeSize);
                rect.attr(
                    GridModel.isWalkableAt(j, i) ? 
                    this.normalNodeAttr : 
                    this.blockNodeAttr
                );
                rects[i][j] = rect;
            }
        }

        this.rects = rects;
    },

    setStartPos: function(x, y) {
        this.setStartEndNodePos('start', x, y);
    },
    setEndPos: function(x, y) {
        this.setStartEndNodePos('end', x, y);
    },
    // helper function to set start or end position
    setStartEndNodePos: function(which, x, y) {
        var coord = this.toPageCoordinate(x, y),
            pageX = coord.x,
            pageY = coord.y,
            nodeSize = this.nodeSize,
            paper = this.paper,
            rect = this['_' + which + 'Node'];

        if (typeof rect == 'undefined') {
            rect = paper.rect(pageX, pageY, nodeSize, nodeSize);
            rect.attr(this[which + 'NodeAttr']);
            this['_' + which + 'Node'] = rect;
        } else {
            rect.attr({
                x: pageX,
                y: pageY,
            }).toFront();
        }
    },

    setAttributeAt: function(x, y, attr, value) {
        if (attr == 'walkable') {
            if (value == true) {
                this.colorizeNodeAt(x, y, this.normalNodeAttr.fill);
            } else {
                this.colorizeNodeAt(x, y, this.blockNodeAttr.fill);
            }
            this.zoomNodeAt(x, y);
        } else if (attr == 'opened') {
            this.colorizeNodeAt(x, y, this.openedNodeAttr.fill);
        } else if (attr == 'closed') {
            this.colorizeNodeAt(x, y, this.closedNodeAttr.fill);
        } else if (attr == 'parent') {
            //this.drawParent(x, y, px, py)
        }

        this.changedNodes.push({x: x, y: y});
    },

    resetCurrent: function() {
        var i, node, fill;

        for (i = 0; node = this.changedNodes[i]; ++i) {
            fill = GridModel.isWalkableAt(node.x, node.y) ?
                   this.normalNodeAttr.fill : 
                   this.blockNodeAttr.fill;
            this.colorizeNodeAt(node.x, node.y, fill);
        }

        if (this.path) {
            this.path.hide();
        }
    },


    colorizeNodeAt: function(x, y, color) {
        this.rects[y][x].animate({
            fill: color,
        }, this.colorizeDuration);
    },

    zoomNodeAt: function(x, y) {
        this.rects[y][x].toFront().attr({
            transform: this.zoomEffect,
        }).animate({
            transform: 's1.0',
        }, this.zoomDuration);
    },


    drawPath: function(path) {
        var svgPath;

        if (!path.length) {
            return;
        }

        svgPath = this.buildSvgPath(path);
        this.path = this.paper.path(svgPath).attr(this.pathAttr);
    },

    // given a path, build its SVG represention.
    buildSvgPath: function(path) {
        var i, strs = [], size = this.nodeSize;

        strs.push('M' + (path[0][0] * size + size / 2) + ' ' 
                + (path[0][1] * size + size / 2));
        for (i = 1; i < path.length; ++i) {
            strs.push('L' + (path[i][0] * size + size / 2) + ' ' 
                    + (path[i][1] * size + size / 2));
        }

        return strs.join('');
    },

    // helper function to convert the page coordinate to grid coordinate
    toGridCoordinate: function(pageX, pageY) {
        var nodeSize = this.nodeSize;
        return {
            x: Math.floor(pageX / nodeSize), 
            y: Math.floor(pageY / nodeSize)
        };
    },


    // helper function to convert the grid coordinate to page coordinate
    toPageCoordinate: function(gridX, gridY) {
        var nodeSize = this.nodeSize;
        return {
            x: gridX * nodeSize, 
            y: gridY * nodeSize
        };
    },



};


window.GridController = {
    init: function() {
        this.initGeometry();
        this.initStartEndPos();
    },

    supportedDispatcher: {
        'opened': true,
        'closed': true,
        'parent': true,
    },

    initGeometry: function() {
        var width, height,
            nodeSize = GridView.nodeSize;

        width = $(window).width();
        height = $(window).height();

        numCols = Math.ceil(width / nodeSize);
        numRows = Math.ceil(height / nodeSize);
        
        GridModel.setSize(numCols, numRows);
    },

    initStartEndPos: function() {
        GridModel.setStartPos(10, 10);
        GridModel.setEndPos(20, 10);
    },

    onMouseDown: function(x, y) {
        if (x == GridModel.getStartX() && y == GridModel.getStartY()) {
            this.isMoving = true;
            this.moving = 'start';
        } else if (x == GridModel.getEndX() && y == GridModel.getEndY()) {
            this.isMoving = true;
            this.moving = 'end';
        } else {
            this.isDrawing = true;
            this.drawStatus = GridModel.isWalkableAt(x, y) ? 'block' : 'clear';
            GridModel.setWalkableAt(x, y, this.drawStatus == 'clear');
        }
    },


    onMouseMove: function(x, y) {
        if (this.isDrawing) {
            if (!((x == GridModel.getStartX() && y == GridModel.getStartY()) ||
                  (x == GridModel.getEndX() && y == GridModel.getEndY()))) {
                GridModel.setWalkableAt(x, y, this.drawStatus == 'clear');
            }
        } else if (this.isMoving) {
            if (this.moving == 'start') {
                GridModel.setStartPos(x, y);
            } else {
                GridModel.setEndPos(x, y);
            }
        }
    },

    onMouseUp: function(x, y) {
        this.isDrawing = false; 
        this.isMoving = false;
    },

    start: function(finder, interval) {
        var self = this,
            record = GridModel.findPath(finder);
        
        this.operations = record.operations;
        this.path = record.path;
        
        this.timer = setInterval(function() {
            self.step(function() {
                self.stop();
                GridView.drawPath(self.path);
            });
        }, interval);

        this.running = true;
    },

    step: function(callback) {
        var operations = this.operations,
            op, support;

        do {
            if (!operations.length) {
                callback();
                return;
            }
            op = operations.shift();
            support = this.supportedDispatcher[op.attr];
        } while (!support);

        GridView.setAttributeAt(op.x, op.y, op.attr, op.value);
    },

    stop: function() {
        clearInterval(this.timer);
        this.running = false;
    },

    resetCurrent: function() {
        GridModel.resetCurrent();
    },

    isRunning: function() {
        return this.running;
    },

};
