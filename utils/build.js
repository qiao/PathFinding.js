#!/usr/bin/env node

var fs         = require('fs');
var path       = require('path');
var uglify     = require('uglify-js');
var browserify = require('browserify');

function build(dest) {
  var browserified = browserify.bundle(__dirname + '/../src/pathfinding.js');
  var namespaced   = 'var PF = (function() {' + browserified + 'return require("/pathfinding");})();';
  var uglified     = uglify(namespaced);
  var bannered     = fs.readFileSync(__dirname + '/banner').toString() + uglified;
  fs.writeFileSync(dest, bannered);
  console.log('built', path.resolve(dest));
}

build(__dirname + '/../lib/pathfinding-browser.js');
