$(function() {
    if (!Modernizr.svg) {
        window.location = './notsupported.html';
    }

    // suppress select events
    $(window).bind('selectstart', function(event) {
        event.preventDefault();
    });

    GridModel.init();
    GridView.init();
    GridController.init();

    Panel.init();
});
