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
        var finder, selected_header, opt1;
        
        selected_header = $(
            '#algorithm_panel ' + 
            '.ui-accordion-header[aria-selected=true]'
        ).attr('id');
        
        switch (selected_header) {
        case 'astar_header': 
            opt1 = $('input[name=astar_option]:checked').val();
            finder = new PF.AStarFinder(PF.AStarFinder[opt1]);
            break;
        case 'breadthfirst_header':
            finder = new PF.BreadthFirstFinder();
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
