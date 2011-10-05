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
            finder = new PF.AStarFinder(PF.AStarFinder.euclidean);
            GridController.start(finder, 0, function() {
                self.showStat();
            });
        });
    },


    updateGeometry: function() {
        (function($ele) {
            $ele.css('top', $(window).height() - $ele.outerHeight() - 40 + 'px');
        })($('#play_panel'));
    },

    showStat: function() {
        var text1 = GridController.getTimeSpent() + 'ms',
            text2 = GridController.getOperationCount() + 'ops';
        $('#timer').text([text1, text2].join(' '));
    },

};
