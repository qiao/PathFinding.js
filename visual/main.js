$(function() {
    // suppress select events
    $(window).bind('selectstart', function(event) {
        event.preventDefault();
    });

    GridModel.init();
    GridView.init();
    GridController.init();

    Panel.init();
});
