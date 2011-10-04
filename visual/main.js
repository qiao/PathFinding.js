// used by Observer pattern
var Notification = function(sender) {
    this._sender = sender;
    this._listeners = [];
};

Notification.prototype = {
    attach: function(listener) {
        this._listeners.push(listener);
    },

    notify: function(args) {
        this._listeners.forEach(function(listener) {
            listener(args);
        });
    },
};


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


/*
//TODO: switch to MVC
var GridMap = function() {
    this.startX = 10;
    this.startY = 10;
    this.endX = 20;
    this.endY = 10;

    this.queue = [];
    this.interval = 50;
    this.gridSize = 30;

    this.initHook();
    this.initPaper();
    this.initDispatcher();
    this.registerEventHandlers();
};


GridMap.prototype = {
    // initialize the hook for path-finding algorithms.
    initHook: function() {
        var self = this;

        // add hook on the `set' method of PF.Node
        var orig = PF.Node.prototype.set;
        PF.Node.prototype.set = function() {
            orig.apply(this, arguments);
            self.queue.push([this.x, this.y, arguments]);
        };
    },

    
    // register the event handlers.
    registerEventHandlers: function() {
        var self = this;

        $('#draw_area').mousedown(function(event) {
            var coord, x, y;

            coord = self.toGridCoordinate(event.pageX, event.pageY);
            x = coord[0]; y = coord[1];

            if (x == self.startX && y == self.startY) {
                self.isMoving = true;
                self.moving = 'start';
            } else if (x == self.endX && y == self.endY) {
                self.isMoving = true;
                self.moving = 'end';
            } else {
                self.isDrawing = true;
                self.drawStatus = self.grid.isWalkableAt(x, y) ? 'block' : 'clear';
                self.toggleNodeAt(x, y);
            }


        });
        
        $(window).mousemove(function(event) {
            var coord, x, y;

            coord = self.toGridCoordinate(event.pageX, event.pageY);
            x = coord[0]; y = coord[1];

            if (self.isDrawing) {
                self.toggleNodeAt(x, y);
            } else if (self.isMoving) {
                self.moveStartEndNode(self.moving, x, y);
            }
        }).mouseup(function(event) {
            self.isDrawing = false;
            self.isMoving = false;
        });
    },


    // initialize the drawing area
    initPaper: function() {
        this.paper = Raphael('draw_area', 0, 0);
        this.updateGeometry();
        this.repaint();
        this.drawStartNode();
        this.drawEndNode();
    },


    drawStartNode: function() {
        this.drawStartEndNode('start');
    },


    drawEndNode: function() {
        this.drawStartEndNode('end');
    },


    drawStartEndNode: function(which) {
        var coord, x, y, node, size = this.gridSize;

        coord = this.toPageCoordinate(this[which + 'X'], this[which + 'Y']);
        x = coord[0]; 
        y = coord[1];

        node = this[which + 'Node'];

        if (typeof node == 'undefined') {
            this[which + 'Node'] = this.paper.rect(x, y, size, size).attr({
                fill: which == 'start' ? 'green' : 'red',
            });
        } else {
            node.attr({
                x: x,
                y: y,
            })
        }
    },

    
    moveStartEndNode: function(which, gridX, gridY) {
        var pageCoord, pageX, pageY;
        pageCoord = this.toPageCoordinate(gridX, gridY);
        pageX = pageCoord[0];
        pageY = pageCoord[1];
        this[which + 'X'] = gridX;
        this[which + 'Y'] = gridY;
        this[which + 'Node'].attr({
            x: pageX,
            y: pageY,
        }).toFront();
    },


    // colorize the node at the given position in the given color
    colorizeNode: function(x, y, color) {
        this.rects[y][x].animate({
            fill: color,
        }, 50);
    },


    // toggle the walkability of node at the given coordinate
    toggleNodeAt: function(x, y) {
        if (this.drawStatus == 'block') {
            this.grid.setWalkableAt(x, y, false);
            this.colorizeNode(x, y, 'grey');
        } else {
            this.grid.setWalkableAt(x, y, true);
            this.colorizeNode(x, y, 'white');
        }

        this.zoomNodeAt(x, y);
    },


    // zoom the node at the given coordinate
    zoomNodeAt: function(x, y) {
        var gridSize = this.gridSize,
            rect = this.rects[y][x];
        window.rect = rect;

        if (!((x == this.startX && y == this.startY) ||
               x == this.endX && y == this.endY)) {
            rect.toFront();       
        }
        rect.attr({
            transform: 's1.2',
        }).animate({
            transform: 's1.0',
        }, 100)
    },


    // initialize the dispatcher for path-finding operations
    initDispatcher: function() {
        var colorizeNode,
            drawParent,
            self = this;

        // draw a line pointing from a node to its parent
        drawParent = function(x, y, parentCoord) {
            var path = self.buildSvgPath([[x, y], parentCoord]);
            self.paper.path(path).attr({
                opacity: 0.4,
            });
        };

        // dispatcher for path-finding operations
        this.dispatcher = {
            opened: function(x, y) {
                self.colorizeNode(x, y, '#98fb98');
            },
            closed: function(x, y) {
                self.colorizeNode(x, y, '#afeeee');
            },
            parent: drawParent,
        };
    },


    // convert the page coordinate to grid coordinate
    toGridCoordinate: function(pageX, pageY) {
        var size = this.gridSize;
        return [Math.floor(pageX / size), Math.floor(pageY / size)];
    },


    // convert the grid coordinate to page coordinate
    toPageCoordinate: function(gridX, gridY) {
        var size = this.gridSize;
        return [gridX * size, gridY * size];
    },


      //Re-calculate the geometry of the drawing area.
      //This method will be called at initiation and 
      //when the window geometry is modified.
    updateGeometry: function() {
        var width, height,
            paperWidth, paperHeight,
            numRows, numCols,
            gridSize = this.gridSize;

        width = $(window).width();
        height = $(window).height();

        numCols = Math.ceil(width / gridSize);
        numRows = Math.ceil(height / gridSize);

        paperWidth = numCols * gridSize;
        paperHeight = numRows * gridSize;

        // update geometry
        this.paper.setSize(paperWidth, paperHeight);

        // update grid
        this.grid = new PF.Grid(numCols, numRows);
    },


    // repaint the grids according to walkability.
    repaint: function() {
        var i, j,
            x, y,
            size = this.gridSize,
            paper = this.paper,
            grid = this.grid,
            rect,
            color,
            rects = [];

        for (i = 0; i < grid.height; ++i) {
            rects[i] = [];

            for (j = 0; j < grid.width; ++j) {
                x = j * size;
                y = i * size;

                color = grid.isWalkableAt(j, i) ? 'white' : 'grey';

                rect = paper.rect(x, y, size, size);
                rect.attr({
                    fill: color,
                    'stroke-opacity': 0.2,
                });
                rects[i][j] = rect;
            }
        }

        this.rects = rects;
    },


    // set the finder for the algorithm.
    setFinder: function(finder) {
        this.finder = finder;
    },


    // start the path-finding procedure.
    start: function() {
        var timeStart, timeEnd, msSpent;
        
        timeStart = new Date();
        // find the path
        this.path = this.finder.findPath(
            this.startX, this.startY, 
            this.endX, this.endY, 
            this.grid
        );

        timeEnd = new Date();
        msSpent = (timeEnd.getMilliseconds() - timeStart.getMilliseconds());

        console.log(msSpent);

        // replay the procedure
        this.replay(); 
    },

    
    // replay the path-finding procedure according to 
    // the records stored in `this.queue'
    replay: function() {
        var self = this;

        this.timer = setInterval(function() {
            self.step(function() {
                clearInterval(self.timer);
                self.drawPath();
            });
        }, this.interval);

    },

    
    // step the replay procedure
    step: function(callback) {
        var queue, front,
            rects,
            dispatcher,
            handler,
            x, y,
            attr, value,

        dispatcher = this.dispatcher;
        rects = this.rects;
        queue = this.queue;

        // take the operation element from the queue.
        // If the operation is not defined in the dispatcher
        // then take the next one, until we find a match or the
        // queue is empty.
        do {
            if (!queue.length) {
                callback();
                return;
            }
            front = queue.shift();
            x = front[0];
            y = front[1];
            attr = front[2][0];
            value = front[2][1];

            handler = dispatcher[attr];
        } while (!handler);

        handler(x, y, value);
    },


    // draw the path.
    drawPath: function() {
        var path, svgPath;
        
        path = this.path;
        if (!path.length) {
            return;
        }

        svgPath = this.buildSvgPath(path);
        this.paper.path(svgPath).attr({
            stroke: 'yellow',
            'stroke-width': 3,
        });
    },

    
    // given a path, build its SVG represention.
    buildSvgPath: function(path) {
        var i, strs = [], size = this.gridSize;

        strs.push('M' + (path[0][0] * size + size / 2) + ' ' 
                  + (path[0][1] * size + size / 2));
        for (i = 1; i < path.length; ++i) {
            strs.push('L' + (path[i][0] * size + size / 2) + ' ' 
                    + (path[i][1] * size + size / 2));
        }

        return strs.join('');
    },
};



var Control = function(gridMap) {
    this.gridMap = gridMap;

    this.initFinderDispatcher();
    this.initUI();
};


Control.prototype = {
    initFinderDispatcher: function() {
        this.finderDispatcher = {
            
        };
    },


    initUI: function() {
        var self = this;

        $('.control_panel').draggable();

        $('#start_button').click(function() {
            self.gridMap.finder = new PF.AStarFinder(PF.AStarFinder.euclidean);
            self.gridMap.start();
        });

        $('.accordion').accordion({
            collapsible: false,
        });

        this.updateGeometry();
    },


    // update the widgets' geometries on window resize
    updateGeometry: function() {
        var BOTTOM_MARGIN = 40;
        (function($ele) {
            $ele.css('top', $(window).height() - $ele.outerHeight() - BOTTOM_MARGIN + 'px');
        })($('#play_panel'));
    },
}


$(function() {
    var gridMap = new GridMap();
    var control = new Control(gridMap);


    // update geometry on window resize
    $(window).resize(function() {
        gridMap.updateGeometry();
        control.updateGeometry();
    });
});
*/

$(function() {
    // suppress select events
    $(window).bind('selectstart', function(event) {
        event.preventDefault();
    });

    GridView.init();
    GridController.init();
});
