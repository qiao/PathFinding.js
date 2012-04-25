/**
 * The pathfinding visualization.
 * It uses raphael.js to show the grids.
 */
var View = {
    nodeSize: 30, // width and height of a single node, in pixel
    nodeStyle: {
        normal: {
            fill: 'white',
            'stroke-opacity': 0.2, // the border
        },
        blocked: {
            fill: 'grey',
            'stroke-opacity': 0.2,
        },
        start: {
            fill: '#0d0',
            'stroke-opacity': 0.2,
        },
        end: {
            fill: '#e40',
            'stroke-opacity': 0.2,
        },
        opened: {
            fill: '#98fb98',
            'stroke-opacity': 0.2,
        },
        closed: {
            fill: '#afeeee',
            'stroke-opacity': 0.2,
        },
        failed: {
            fill: '#ff8888',
            'stroke-opacity': 0.2,
        },
    },
    nodeColorizeEffect: {
        duration: 50,
    },
    nodeZoomEffect: {
        duration: 200,
        transform: 's1.2', // scale by 1.2x
        transformBack: 's1.0',
    },
    pathStyle: {
        stroke: 'yellow',
        'stroke-width': 3,
    },
    init: function(opts) {
        this.numCols = opts.numCols;
        this.numRows = opts.numRows;
        this.paper   = Raphael('draw_area');
        this.$stats  = $('#stats');
    },
    /**
     * Generate the grid asynchronously.
     * This method will be a very expensive task.
     * On my firefox, it takes 3 seconds to generate a 64x36 grid.
     * Chrome will behave much better, which completes the task within 1s.
     * Therefore, in order to not to block the rendering of browser ui, 
     * I decomposed the task into smaller ones. Each will only generate a 
     * row.
     */
    generateGrid: function(callback) {
        var i, j, x, y, 
            paper,
            rect, rects,
            normalStyle, nodeSize,
            createRowTask, sleep, tasks,
            nodeSize    = this.nodeSize,
            normalStyle = this.nodeStyle.normal,
            numCols     = this.numCols,
            numRows     = this.numRows,
            paper       = this.paper,
            rects       = this.rects = [],
            $stats      = this.$stats;

        paper.setSize(numCols * nodeSize, numRows * nodeSize);

        createRowTask = function(rowId) {
            return function(done) {
                rects[rowId] = [];
                for (j = 0; j < numCols; ++j) {
                    x = j * nodeSize;
                    y = rowId * nodeSize;

                    rect = paper.rect(x, y, nodeSize, nodeSize);
                    rect.attr(normalStyle);
                    rects[rowId].push(rect);
                }
                $stats.text(
                    'generating grid ' + 
                    Math.round((rowId + 1) / numRows * 100) + '%'
                );
                done(null);
            };
        };

        sleep = function(done) {
            setTimeout(function() {
                done(null);
            }, 0);
        };

        tasks = [];
        for (i = 0; i < numRows; ++i) {
            tasks.push(createRowTask(i));
            tasks.push(sleep);
        }

        async.series(tasks, function() {
            console.log('grid generated')
            if (callback) {
                callback();
            }
        });
    },
    setStartPos: function(gridX, gridY) {
        var coord = this.toPageCoordinate(gridX, gridY);
        if (!this.startNode) {
            this.startNode = this.paper.rect(
                coord[0],
                coord[1],
                this.nodeSize, 
                this.nodeSize
            ).attr(this.nodeStyle.normal)
             .animate(this.nodeStyle.start, 1000);
        } else {
            this.startNode.attr({ x: coord[0], y: coord[1] }).toFront();
        }
    },
    setEndPos: function(gridX, gridY) {
        var coord = this.toPageCoordinate(gridX, gridY);
        if (!this.endNode) {
            this.endNode = this.paper.rect(
                coord[0],
                coord[1],
                this.nodeSize, 
                this.nodeSize
            ).attr(this.nodeStyle.normal)
             .animate(this.nodeStyle.end, 1000);
        } else {
            this.endNode.attr({ x: coord[0], y: coord[1] }).toFront();
        }
    },
    /**
     * Set the attribute of the node at the given coordinate.
     */
    setAttributeAt: function(gridX, gridY, attr, value) {
        var color, nodeStyle = this.nodeStyle;
        switch (attr) {
        case 'walkable':
            color = value ? nodeStyle.normal.fill : nodeStyle.blocked.fill;
            this.colorizeNodeAt(gridX, gridY, color);
            this.zoomNodeAt(gridX, gridY);
            break;
        case 'opened':
            this.colorizeNodeAt(gridX, gridY, nodeStyle.opened.fill);
            break;
        case 'closed':
            this.colorizeNodeAt(gridX, gridY, nodeStyle.closed.fill);
            break;
        case 'parent':
            // XXX: Maybe draw a line from this node to its parent?
            // This would be expensive.
            break;
        default:
            console.error('unsupported operation: ' + attr + ':' + value);
        }
    },
    colorizeNodeAt: function(gridX, gridY, color) {
        this.rects[gridY][gridX].animate({
            fill: color
        }, this.nodeColorizeEffect.duration);
    },
    zoomNodeAt: function(gridX, gridY) {
        this.rects[gridY][gridX].toFront().attr({
            transform: this.nodeZoomEffect.transform,
        }).animate({
            transform: this.nodeZoomEffect.transformBack,
        }, this.nodeZoomEffect.duration);
    },
    drawPath: function(path) {
        if (!path.length) {
            return;
        }
        var svgPath = this.buildSvgPath(path);
        this.path = paper.path(svgPath).attr(this.pathStyle);
    },
    /**
     * Given a path, build its SVG represention.
     */
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
    /**
     * Helper function to convert the page coordinate to grid coordinate
     */
    toGridCoordinate: function(pageX, pageY) {
        return [
            Math.floor(pageX / this.nodeSize), 
            Math.floor(pageY / this.nodeSize)
        ];
    },
    /**
     * helper function to convert the grid coordinate to page coordinate
     */
    toPageCoordinate: function(gridX, gridY) {
        return [
            gridX * this.nodeSize, 
            gridY * this.nodeSize
        ];
    },
};


/**
 * The visualization controller, which works as a state machine.
 */
var Controller = StateMachine.create({
    initial: 'none',
    events: [
        { name: 'init',    from: 'none',      to: 'before'    },
        { name: 'start',   from: 'before',    to: 'starting'  },
        { name: 'search',  from: 'starting',  to: 'searching' },
        { name: 'restart', from: 'searching', to: 'starting'  },
        { name: 'pause',   from: 'searching', to: 'paused'    },
        { name: 'finish',  from: 'searching', to: 'finished'  },
        { name: 'resume',  from: 'paused',    to: 'searching' },
        { name: 'cancel',  from: 'paused',    to: 'before'    },
        { name: 'restart', from: 'finished',  to: 'starting'  },
        { name: 'clear',   from: 'finished',  to: 'before'    },
        { name: 'modify',  from: 'finished',  to: 'modified'  },
        { name: 'start',   from: 'modified',  to: 'starting'  },
        { name: 'clear',   from: 'modified',  to: 'before'    },
        { name: 'reset',   from: '*',         to: 'before'    },
    ],
});

$.extend(Controller, {
    onleavenone: function() { // init (asynchronous transition)
        View.init({
            numCols: 64,
            numRows: 36
        });
        View.generateGrid(function() {
            Controller.setDefaultStartEndPos();
            Controller.transition(); // transit to the next state
        });
        return StateMachine.ASYNC;
    },
    onstart: function(event, from, to) {
        // Clears any existing search progress and then immediately 
        // goes to searching state.
    },
    onsearch: function(event, from, to) { 
    },
    onrestart: function(event, from, to) { 
    },
    onpause: function(event, from, to) { 
    },
    onfinish: function(event, from, to) { 
    },
    oncancel: function(event, from, to) { 
    },
    onclear: function (event, from, to) { 
    },
    onmodify: function onmodify(event, from, to) { 

    },
    onreset: function onreset(event, from, to) {
    },
    /**
     * When initializing, this method will be called to set the positions 
     * of start node and end node.
     * It will detect user's display size, and compute the best positions.
     */
    setDefaultStartEndPos: function() {
        var width, height,
            marginRight, availWidth,
            centerX, centerY,
            startX, startY,
            endX, endY,
            nodeSize = View.nodeSize;

        width  = $(window).width();
        height = $(window).height();

        marginRight = $('#right_column').width();
        availWidth = width - marginRight;

        centerX = Math.ceil(availWidth / 2 / nodeSize);
        centerY = Math.floor(height / 2 / nodeSize);

        startX = centerX - 5;
        startY = centerY;
        endX = centerX + 5;
        endY = centerY;

        View.setStartPos(startX, startY);
        View.setEndPos(endX, endY);
    },
});

var Panel = {
    init: function() {
        $('.panel').draggable();
        $('.accordion').accordion({
            collapsible: false,
        });
    },
    /**
     * Get the user selected path-finder.
     * TODO: clean up this messy code.
     */
    getFinder: function() {
        var finder, selected_header, heuristic, allowDiagonal, biDirectional;
        
        selected_header = $(
            '#algorithm_panel ' + 
            '.ui-accordion-header[aria-selected=true]'
        ).attr('id');
        
        switch (selected_header) {

        case 'astar_header': 
            allowDiagonal = typeof $('#astar_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            biDirectional = typeof $('#astar_section ' +
                                     '.bi-directional:checked').val() != 'undefined';
            heuristic = $('input[name=astar_heuristic]:checked').val();
            if (biDirectional) {
                finder = new PF.BiAStarFinder({
                    allowDiagonal: allowDiagonal, 
                    heuristic: PF.Heuristic[heuristic]
                });
            } else {
                finder = new PF.AStarFinder({
                    allowDiagonal: allowDiagonal, 
                    heuristic: PF.Heuristic[heuristic]
                });
            }
            break;

        case 'breadthfirst_header':
            allowDiagonal = typeof $('#breadthfirst_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            biDirectional = typeof $('#breadthfirst_section ' +
                                     '.bi-directional:checked').val() != 'undefined';
            if (biDirectional) {
                finder = new PF.BiBreadthFirstFinder({allowDiagonal: allowDiagonal});
            } else {
                finder = new PF.BreadthFirstFinder({allowDiagonal: allowDiagonal});
            }
            break;

        case 'bestfirst_header':
            allowDiagonal = typeof $('#bestfirst_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            biDirectional = typeof $('#bestfirst_section ' +
                                     '.bi-directional:checked').val() != 'undefined';
            heuristic = $('input[name=bestfirst_heuristic]:checked').val();
            if (biDirectional) {
                finder = new PF.BiBestFirstFinder({
                    allowDiagonal: allowDiagonal, 
                    heuristic: PF.Heuristic[heuristic]
                });
            } else {
                finder = new PF.BestFirstFinder({
                    allowDiagonal: allowDiagonal, 
                    heuristic: PF.Heuristic[heuristic]
                });
            }
            break;

        case 'dijkstra_header':
            allowDiagonal = typeof $('#dijkstra_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            biDirectional = typeof $('#dijkstra_section ' +
                                     '.bi-directional:checked').val() != 'undefined';
            if (biDirectional) {
                finder = new PF.BiDijkstraFinder({allowDiagonal: allowDiagonal});
            } else {
                finder = new PF.DijkstraFinder({allowDiagonal: allowDiagonal});
            }
            break;

        case 'jump_point_header':
            heuristic = $('input[name=jump_point_heuristic]:checked').val();
            finder = new PF.JumpPointFinder({
              heuristic: PF.Heuristic[heuristic]
            });
            break;

        }

        return finder;
    }
};


    //initGeometry: function() {

        //this.updateGeometry();
    //},

    //initListeners: function() {
        //var self = this, finder, interval;

        //$(window).resize(function() {
            //self.updateGeometry();
        //});

        //$('#start_button').click(function() {
            //if (GridController.isRunning()) {
                //return;
            //}
            //GridController.resetCurrent();
            //finder = self.getFinder();
            //interval = 3;
            //GridController.start(finder, interval, function() {
                //self.showStat();
            //});
        //});
        //$('#stop_button').click(function() {
            //GridController.stop();
        //});
        //$('#reset_button').click(function() {
            //GridController.resetAll();
        //});

        //$('#hide_instruction').click(function() {
            //$('#help_panel').slideUp();
        //});

        //$('.option_label').click(function() {
            //$(this).prev().click();
        //});
    //},


    //// XXX: clean up this messy code

    //updateGeometry: function() {
        //(function($ele) {
            //$ele.css('top', $(window).height() - $ele.outerHeight() - 40 + 'px');
        //})($('#play_panel'));
    //},

    //showStat: function() {
        //var texts = [
            //'time: ' + GridController.getTimeSpent() + 'ms',
            //'length: ' + GridController.getPathLength(),
            //'operations: ' + GridController.getOperationCount()
        //];
        //$('#stats').show().html(texts.join('<br>'));
    //},

$(function() {
    if (!Modernizr.svg) {
        window.location = './notsupported.html';
    }


    // suppress select events
    $(window).bind('selectstart', function(event) {
        event.preventDefault();
    });

    Panel.init();
    Controller.init()

    //GridModel.init();
    //GridView.init();
    //GridController.init();

});
