var Demo = function() {
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


Demo.prototype = {
    initHook: function() {
        var self = this;

        // add hook on the `set' method of PF.Node
        var orig = PF.Node.prototype.set;
        PF.Node.prototype.set = function() {
            orig.apply(this, arguments);
            self.queue.push([this.x, this.y, arguments]);
        };
    },


    initPaper: function() {
        this.paper = Raphael('draw_area', 0, 0);
        this.gridSize = 30;
    },


    initDispatcher: function() {
        var colorizeNode,
            drawParent,
            self = this;

        colorizeNode = function(x, y, color) {
            self.rects[y][x].animate({
                fill: color,
            }, 10)
        };

        drawParent = function(x, y, coord) {
            var path = self.buildSvgPath([[x, y], coord]);
            self.paper.path(path).attr({
                opacity: 0.4,
            });
        };

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


    repaint: function() {
        var i, j,
            x, y,
            size = this.gridSize,
            paper = this.paper,
            grid = this.grid,
            rect,
            rects = [];

        for (i = 0; i < grid.height; ++i) {
            rects[i] = [];

            for (j = 0; j < grid.width; ++j) {
                x = j * size;
                y = i * size;

                rect = paper.rect(x, y, size, size);
                rect.attr({
                    fill: 'white',
                    'stroke-opacity': 0.2,
                });
                rects[i][j] = rect;
            }
        }

        this.rects = rects;
    },


    setFinder: function(finder) {
        this.finder = finder;
    },


    start: function() {
        this.path = this.finder.findPath(
            this.startX, this.startY, 
            this.endX, this.endY, 
            this.grid
        );

        this.replay(); 
    },

    
    replay: function() {
        var self = this;

        this.timer = setInterval(function() {
            self.step(function() {
                clearInterval(self.timer);
                self.drawPath();
            });
        }, this.interval);

    },

    
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


    drawPath: function() {
        var path = this.buildSvgPath(this.path);
        this.paper.path(path).attr({
            stroke: 'yellow',
            'stroke-width': 3,
        });
    },

    
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



var Control = function(demo) {
    this.demo = demo;

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
            self.demo.finder = new PF.AStarFinder(PF.AStarFinder.euclidean);
            self.demo.start();
        });

        $('.accordion').accordion({
            collapsible: true
        });
    },


    updateGeometry: function() {
        (function($ele) {
            $ele.css('top', $(window).height() - $ele.outerHeight() - 40 + 'px');
        })($('#play_panel'));
    },
}


$(function() {
    var demo = new Demo();
    var control = new Control(demo);

    $(window).resize(function() {
        demo.updateGeometry();
        control.updateGeometry();
    });
});
