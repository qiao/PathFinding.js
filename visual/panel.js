window.Panel = {
    init: function() {
        this.initGeometry();
        this.initListeners();
    },

    initGeometry: function() {
        $('.control_panel').draggable();
        $('.accordion').accordion({
            collapsible: false,
        });

        this.updateGeometry();
    },

    initListeners: function() {
        var self = this;

        $(window).resize(function() {
            self.updateGeometry();
        });

        $('#start_button').click(function() {
            if (GridController.isRunning()) {
                return;
            }
            GridController.resetCurrent();
            finder = self.getFinder();
            GridController.start(finder, 0, function() {
                self.showStat();
            });
        });
        $('#stop_button').click(function() {
            GridController.stop();
        });
    },


    // XXX: clean up this messy code
    getFinder: function() {
        var finder, selected_header, allowDiagonal, heuristic;
        
        selected_header = $(
            '#algorithm_panel ' + 
            '.ui-accordion-header[aria-selected=true]'
        ).attr('id');
        
        switch (selected_header) {
        case 'astar_header': 
            allowDiagonal = typeof $('#astar_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            heuristic = $('input[name=astar_heuristic]:checked').val();
            finder = new PF.AStarFinder(allowDiagonal, PF.AStarFinder[heuristic]);
            break;
        case 'breadthfirst_header':
            allowDiagonal = typeof $('#breadthfirst_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            finder = new PF.BreadthFirstFinder(allowDiagonal);
            break;
        case 'bestfirst_header':
            allowDiagonal = typeof $('#bestfirst_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            heuristic = $('input[name=bestfirst_heuristic]:checked').val();
            finder = new PF.BestFirstFinder(allowDiagonal, PF.AStarFinder[heuristic]);
            break;
        case 'dijkstra_header':
            allowDiagonal = typeof $('#dijkstra_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            finder = new PF.DijkstraFinder(allowDiagonal);
            break;
        }

        return finder;
    },


    updateGeometry: function() {
        (function($ele) {
            $ele.css('top', $(window).height() - $ele.outerHeight() - 40 + 'px');
        })($('#play_panel'));
    },

    showStat: function() {
        var text1 = GridController.getTimeSpent() + 'ms',
            text2 = GridController.getOperationCount() + 'ops';
        $('#timer').show().text([text1, text2].join(' '));
    },

};
