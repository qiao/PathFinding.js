window.Panel = {
    init: function() {
        this.initGeometry();
        this.initListeners();
    },

    initGeometry: function() {
        $('.control_panel').draggable().show();
        $('.accordion').accordion({
            collapsible: false,
        });
        //$('#speed_slider').slider();

        this.updateGeometry();
    },

    initListeners: function() {
        var self = this, finder, interval;

        $(window).resize(function() {
            self.updateGeometry();
        });

        $('#start_button').click(function() {
            if (GridController.isRunning()) {
                return;
            }
            GridController.resetCurrent();
            finder = self.getFinder();
            interval = 3;
            GridController.start(finder, interval, function() {
                self.showStat();
            });
        });
        $('#stop_button').click(function() {
            GridController.stop();
        });
        $('#reset_button').click(function() {
            GridController.resetAll();
        });

        $('#hide_instruction').click(function() {
            $('#help_panel').slideUp();
        });

        $('.option_label').click(function() {
            $(this).prev().click();
        });
    },


    // XXX: clean up this messy code
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
                finder = new PF.BiAStarFinder(allowDiagonal, PF.Heuristic[heuristic]);
            } else {
                finder = new PF.AStarFinder(allowDiagonal, PF.Heuristic[heuristic]);
            }
            break;

        case 'breadthfirst_header':
            allowDiagonal = typeof $('#breadthfirst_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            biDirectional = typeof $('#breadthfirst_section ' +
                                     '.bi-directional:checked').val() != 'undefined';
            if (biDirectional) {
                finder = new PF.BiBreadthFirstFinder(allowDiagonal);
            } else {
                finder = new PF.BreadthFirstFinder(allowDiagonal);
            }
            break;

        case 'bestfirst_header':
            allowDiagonal = typeof $('#bestfirst_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            biDirectional = typeof $('#bestfirst_section ' +
                                     '.bi-directional:checked').val() != 'undefined';
            heuristic = $('input[name=bestfirst_heuristic]:checked').val();
            if (biDirectional) {
                finder = new PF.BiBestFirstFinder(allowDiagonal, PF.Heuristic[heuristic]);
            } else {
                finder = new PF.BestFirstFinder(allowDiagonal, PF.Heuristic[heuristic]);
            }
            break;

        case 'dijkstra_header':
            allowDiagonal = typeof $('#dijkstra_section ' +
                                     '.allow_diagonal:checked').val() != 'undefined';
            biDirectional = typeof $('#dijkstra_section ' +
                                     '.bi-directional:checked').val() != 'undefined';
            if (biDirectional) {
                finder = new PF.BiDijkstraFinder(allowDiagonal);
            } else {
                finder = new PF.DijkstraFinder(allowDiagonal);
            }
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
