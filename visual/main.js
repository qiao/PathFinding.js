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
            rect, 
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
 * See files under the `doc` folder for details.
 */
var Controller = StateMachine.create({
    initial: 'none',
    events: [
        { name: 'init'      , from: 'none'       , to: 'ready'         } ,

        { name: 'dragStart' , from: 'ready'      , to: 'draggingStart' } ,
        { name: 'dragEnd'   , from: 'ready'      , to: 'draggingEnd'   } ,
        { name: 'drawWall'  , from: 'ready'      , to: 'drawingWall'   } ,
        { name: 'eraseWall' , from: 'ready'      , to: 'erasingWall'   } ,

        { name: 'search'    , from: 'starting'   , to: 'searching'     } ,
        { name: 'pause'     , from: 'searching'  , to: 'paused'        } ,
        { name: 'finish'    , from: 'searching'  , to: 'finished'      } ,
        { name: 'resume'    , from: 'paused'     , to: 'searching'     } ,
        { name: 'cancel'    , from: 'paused'     , to: 'ready'         } ,
        { name: 'modify'    , from: 'finished'   , to: 'modified'      } ,
        { name: 'reset'     , from: '*'          , to: 'ready'         } ,

        { name: 'clear'     , from: ['finished'  , 'modified'] , to:'ready'     },
        { name: 'start'     , from: ['ready'     , 'modified'] , to:'starting'  },
        { name: 'restart'   , from: ['searching' , 'finished'] , to: 'starting' },

        { 
          name: 'rest',
          from: ['draggingStart', 'draggingEnd', 'drawingWall', 'erasingWall'], 
          to  : 'ready' 
        },
    ],
});

$.extend(Controller, {
    gridSize: [64, 36], // number of nodes horizontally and vertically
    /**
     * Asynchronous transition from `none` state to `ready` state.
     */
    onleavenone: function() {
        var numCols = this.gridSize[0],
            numRows = this.gridSize[1];

        this.grid = new PF.Grid(numCols, numRows);

        View.init({
            numCols: numCols,
            numRows: numRows,
        });
        View.generateGrid(function() {
            Controller.setDefaultStartEndPos();
            Controller.bindEvents();
            Controller.transition(); // transit to the next state (ready)
        });

        return StateMachine.ASYNC;
    },
    bindEvents: function() {
        $('#draw_area').mousedown($.proxy(this.mousedown, this));
        $(window)
            .mousemove($.proxy(this.mousemove, this))
            .mouseup($.proxy(this.mouseup, this));
    
    },
    mousedown: function (event) {
        var coord = View.toGridCoordinate(event.pageX, event.pageY),
            gridX = coord[0],
            gridY = coord[1],
            grid  = this.grid;

        if (this.can('dragStart') && this.isStartPos(gridX, gridY)) {
            this.dragStart();
            return;
        } 
        if (this.can('dragEnd') && this.isEndPos(gridX, gridY)) {
            this.dragEnd();
            return;
        }
        if (this.can('drawWall') && grid.isWalkableAt(gridX, gridY)) {
            this.drawWall(gridX, gridY);
            return;
        }
        if (this.can('eraseWall') && !grid.isWalkableAt(gridX, gridY)) {
            this.eraseWall(gridX, gridY);
        }
    },
    mousemove: function(event) {
        var coord = View.toGridCoordinate(event.pageX, event.pageY),
            grid = this.grid,
            gridX = coord[0],
            gridY = coord[1];

        switch (this.current) {
        case 'draggingStart':
            this.setStartPos(gridX, gridY);
            break;
        case 'draggingEnd':
            this.setEndPos(gridX, gridY);
            break;
        case 'drawingWall':
            if (!this.isStartOrEndPos(gridX, gridY)) {
                this.setWalkableAt(gridX, gridY, false);
            }
            break;
        case 'erasingWall':
            if (!this.isStartOrEndPos(gridX, gridY)) {
                this.setWalkableAt(gridX, gridY, true);
            }
            break;
        }
    },
    mouseup: function(event) {
        if (Controller.can('rest')) {
            Controller.rest();
        }
    },
    ondrawWall: function(event, from, to, gridX, gridY) {
        this.setWalkableAt(gridX, gridY, false);
    },
    oneraseWall: function(event, from, to, gridX, gridY) {
        this.setWalkableAt(gridX, gridY, true);
    },
    /**
     * Clears any existing search progress and then immediately 
     * goes to searching state.
     */
    onstart: function(event, from, to) {
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
            endX, endY,
            nodeSize = View.nodeSize;

        width  = $(window).width();
        height = $(window).height();

        marginRight = $('#algorithm_panel').width();
        availWidth = width - marginRight;

        centerX = Math.ceil(availWidth / 2 / nodeSize);
        centerY = Math.floor(height / 2 / nodeSize);

        this.setStartPos(centerX - 5, centerY);
        this.setEndPos(centerX + 5, centerY);
    },
    setStartPos: function(gridX, gridY) {
        this.startX = gridX;
        this.startY = gridY;
        View.setStartPos(gridX, gridY);
    },
    setEndPos: function(gridX, gridY) {
        this.endX = gridX;
        this.endY = gridY;
        View.setEndPos(gridX, gridY);
    },
    setWalkableAt: function(gridX, gridY, walkable) {
        this.grid.setWalkableAt(gridX, gridY, walkable);
        View.setAttributeAt(gridX, gridY, 'walkable', walkable);
    },
    isStartPos: function(gridX, gridY) {
        return gridX === this.startX && gridY === this.startY;
    },
    isEndPos: function(gridX, gridY) {
        return gridX === this.endX && gridY === this.endY;
    },
    isStartOrEndPos: function(gridX, gridY) {
        return this.isStartPos(gridX, gridY) || this.isEndPos(gridX, gridY);
    },
});


/**
 * The control panel.
 */
var Panel = {
    init: function() {
        var $algo = $('#algorithm_panel');
        $('.panel').draggable();
        $('.accordion').accordion({
            collapsible: false,
        });
        $('.option_label').click(function() {
            $(this).prev().click();
        });
        $('#hide_instructions').click(function() {
            $('#instructions_panel').slideUp();
        });
        $('#play_panel').css({
            top: $algo.offset().top + $algo.outerHeight() + 20
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

$(document).ready(function() {
    if (!Modernizr.svg) {
        window.location = './notsupported.html';
    }

    // suppress select events
    $(window).bind('selectstart', function(event) {
        event.preventDefault();
    });

    // initialize visualization
    Panel.init();
    Controller.init()
});
