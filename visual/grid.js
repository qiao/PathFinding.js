window.GridModel = {
    sizeChange: new Notification(this),
    attrChange: new Notification(this),
    startPosChange: new Notification(this),
    endPosChange: new Notification(this),

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
        return this._grid.isWalkableAt(x, y);
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
            attr: 'walkable',
            value: value,
        })
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
        fill: 'green',
        'stroke-opacity': 0.2,
    },
    endNodeAttr: {
        fill: 'red',
        'stroke-opacity': 0.2,
    },
    colorizeDuration: 50,
    zoomEffect: 's1.2',
    zoomDuration: 200,

    // general initialization
    init: function(width, height) {
        this.initPaper();
        this.initListeners();
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
            self.setAttrAt(args.x, args.y, args.attr, args.value);
        });


        // listeners for browser events
        $('#draw_area').mousedown(function(event) {
            var coord, x, y;
            coord = self.toGridCoordinate(event.pageX, event.pageY);
            x = coord.x; y = coord.y;

            GridController.onMouseDown(x, y);
        }).mousemove(function(event) {
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
            });
        }
    },

    setAttrAt: function(x, y, attr, value) {
        if (attr == 'walkable') {
            if (value == true) {
                this.colorizeNodeAt(x, y, this.normalNodeAttr.fill);
            } else {
                this.colorizeNodeAt(x, y, this.blockNodeAttr.fill);
            }
        }
        this.zoomNodeAt(x, y);
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
            GridModel.setWalkableAt(x, y, this.drawStatus == 'clear');
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

};
