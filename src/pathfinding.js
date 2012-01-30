/**
 * @namespace PF 
 */
var PF = module.exports = {
    
}

// Export for Node.js and CommonJS
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = PF;
    }
    exports.PF = PF;
}
