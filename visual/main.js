var Demo = function() {
    this.initHook();
    this.initPaper();
    this.initDispatcher();
    this.updateGeometry();
    this.repaint();

    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.finder = new PF.AStarFinder(PF.AStarFinder.euclidean);
    this.queue = [];
    this.interval = 5;
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
            }, 20)
        };

        drawParent = function(x, y, coord) {
            var path = self.buildSvgPath([[x, y], coord]);
            self.paper.path(path).attr({
                opacity: 0.4,
            });
        };

        this.dispatcher = {
            opened: function(x, y) {
                colorizeNode(x, y, '#abf26d');
            },
            closed: function(x, y) {
                colorizeNode(x, y, '#61b7cf');
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
        var availableWidth,
            availableHeight,
            paperWidth,
            paperHeight,
            numRows,
            numCols;
        
        // calculate paper geometry
        availableWidth = $('#wrapper').width() - $('#control_panel').width();
        availableHeight = $(window).height() - $('#title').height();

        numCols = Math.floor((availableWidth - 20) / this.gridSize);
        numRows = Math.floor((availableHeight - 20) / this.gridSize);

        paperWidth = numCols * this.gridSize;
        paperHeight = numRows * this.gridSize;

        // update geometry
        this.paper.setSize(paperWidth, paperHeight);

        // update grid
        this.grid = new PF.Grid(numCols, numRows);
        console.log('update');
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


    start: function() {
        this.path = this.finder.findPath(0, 0, 10, 10, this.grid);

        this.replay(); 
    },

    
    replay: function() {
        var self = this;

        this.timer = setInterval(function() {
            self.step(function() {
                clearInterval(this.timer);
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
            stroke: 'yellow'
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


$(function() {
    var demo = new Demo();
    demo.start();

    $(window).resize(function() {
        demo.updateGeometry();
    });
});
