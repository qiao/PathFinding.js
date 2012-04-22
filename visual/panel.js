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
    },


    updateGeometry: function() {
        (function($ele) {
            $ele.css('top', $(window).height() - $ele.outerHeight() - 40 + 'px');
        })($('#play_panel'));
    },

    showStat: function() {
        var texts = [
            'time: ' + GridController.getTimeSpent() + 'ms',
            'length: ' + GridController.getPathLength(),
            'operations: ' + GridController.getOperationCount()
        ];
        $('#stats').show().html(texts.join('<br>'));
    },

};
