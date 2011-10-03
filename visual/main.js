var GridMap = function() {
    this.initHook();
    this.initPaper();
    this.initDispatcher();


    this.registerEventHandlers();

    this.startX = 10;
    this.startY = 10;
    this.endX = 20;
    this.endY = 10;
    this.queue = [];
    this.interval = 2;
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
            self.isDrawing = true;

            coord = self.toGridCoordinate(event.pageX, event.pageY);
            x = coord[0]; y = coord[1];

            self.drawStatus = self.grid.isWalkableAt(x, y) ? 'block' : 'clear';

            self.toggleNodeAt(x, y);

        }).mousemove(function(event) {
            var coord, x, y;

            if (!self.isDrawing) {
                return;
            }

            coord = self.toGridCoordinate(event.pageX, event.pageY);
            x = coord[0]; y = coord[1];

            self.toggleNodeAt(x, y);

        }).mouseup(function(event) {
            self.isDrawing = false;
        });
    },


    // initialize the drawing area
    initPaper: function() {
        this.paper = Raphael('draw_area', 0, 0);
        this.gridSize = 30;

        this.updateGeometry();
        this.repaint();
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

        rect.toFront().attr({
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


    /**
     * Re-calculate the geometry of the drawing area.
     * This method will be called at initiation and 
     * when the window geometry is modified.
     */
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

    // suppress select events
    $(window).bind('selectstart', function(event) {
        event.preventDefault();
    });

    // update geometry on window resize
    $(window).resize(function() {
        gridMap.updateGeometry();
        control.updateGeometry();
    });
});
