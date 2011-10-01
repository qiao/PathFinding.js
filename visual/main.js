var Demo = function() {
    this.initHook();
    this.initPaper();
    this.initDispatcher();
    this.updateGeometry();
    this.repaint();

    this.finder = new PF.AStarFinder();
    this.queue = [];
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
        this.dispatcher = {
            opened: '#abf26d',
            closed: '#61b7cf',
        };
    },


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
        var finder, path;

        finder = new PF.AStarFinder();
        path = finder.findPath(0, 0, 10, 10, this.grid);

        this.replay(); 
    },

    
    replay: function() {
        var self = this;

        this.timer = setInterval(function() {
            self.step();
        }, 10)

    },

    
    step: function() {
        var queue, front,
            rects,
            dispatcher,
            x, y,
            attr, value,

        dispatcher = this.dispatcher;
        rects = this.rects;
        queue = this.queue;

        if (!queue.length) {
            clearInterval(this.timer);
            return;
        }
        front = queue.shift();
        x = front[0];
        y = front[1];
        attr = front[2][0];
        value = front[2][1];

        color = dispatcher[attr];
        if (color) {
            rects[y][x].animate({
                fill: color,
            }, 50);
        }
    },

};


$(function() {
    var demo = new Demo();
    demo.start();

    $(window).resize(function() {
        demo.updateGeometry();
    });
});
