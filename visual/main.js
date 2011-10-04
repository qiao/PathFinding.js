$(function() {
    // suppress select events
    $(window).bind('selectstart', function(event) {
        event.preventDefault();
    });

    GridView.init();
    GridController.init();
});
