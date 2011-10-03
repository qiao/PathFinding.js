var GridMap = function() {
    this.initHook();
    this.initPaper();
    this.initDispatcher();
    this.updateGeometry();
    this.repaint();

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


    // initialize the drawing area
    initPaper: function() {
        this.paper = Raphael('draw_area', 0, 0);
        this.gridSize = 30;
    },


    // initialize the dispatcher for path-finding operations
    initDispatcher: function() {
        var colorizeNode,
            drawParent,
            self = this;

        // colorize the node at the given position in the given color
        colorizeNode = function(x, y, color) {
            self.rects[y][x].animate({
                fill: color,
            }, 10)
        };

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
                colorizeNode(x, y, '#98fb98');
            },
            closed: function(x, y) {
                colorizeNode(x, y, '#afeeee');
            },
            parent: drawParent,
        };
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
        // find the path
        this.path = this.finder.findPath(
            this.startX, this.startY, 
            this.endX, this.endY, 
            this.grid
        );

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
            func,
            x, y,
            attr, value,

        dispatcher = this.dispatcher;
        rects = this.rects;
        queue = this.queue;

        if (!queue.length) {
            callback();
            return;
        }
        front = queue.shift();
        x = front[0];
        y = front[1];
        attr = front[2][0];
        value = front[2][1];

        func = dispatcher[attr];
        if (func) {
            func(x, y, value);
        }
    },


    // draw the path.
    drawPath: function() {
        var path = this.buildSvgPath(this.path);
        this.paper.path(path).attr({
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
    this.updateGeometry();
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
