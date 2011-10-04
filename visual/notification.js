// used by Observer pattern
var Notification = function(sender) {
    this._sender = sender;
    this._listeners = [];
};

Notification.prototype = {
    attach: function(listener) {
        this._listeners.push(listener);
    },

    notify: function(args) {
        this._listeners.forEach(function(listener) {
            listener(args);
        });
    },
};
