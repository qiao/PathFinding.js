#!/usr/bin/env node

var fs         = require('fs');
var path       = require('path');
var uglify     = require('uglify-js');
var browserify = require('browserify');

function build(dest, options) {
  options || (options = {});
  options.uglify || (options.uglify = false);

  var browserified = browserify.bundle(__dirname + '/../src/PathFinding.js');
  var namespaced   = 'var PF = (function() {' + browserified + 'return require("/PathFinding");})();';
  var bannered     = fs.readFileSync(__dirname + '/banner').toString() + namespaced;
  fs.writeFileSync(dest, options.uglify ? uglify(bannered) : bannered);
  console.log('built', path.resolve(dest));
}

build(__dirname + '/../lib/pathfinding-browser.js');
build(__dirname + '/../lib/pathfinding-browser.min.js', { uglify: true });
