#!/usr/bin/env node

var PF = require('..');
var parseMap = require('./parse_map').parse;

/**
 * @param opts.mapFilename
 * @param opts.startX
 * @param opts.startY
 * @param opts.endX
 * @param opts.endY
 * @param opts.finder
 */
function benchmark(opts) {
  var map = parseMap(opts.mapFilename);
  var grid = new PF.Grid(map.width, map.height, map.grid);

  var result = profile(function() {
    return opts.finder.findPath(
      opts.startX, opts.startY,
      opts.endX, opts.endY,
      grid
    );
  });
  var path = result.returnValue;
  var time = result.time;
  console.log(opts.name, 'length:', path.length, 'time:', time+'ms');
}
exports.benchmark = benchmark;

function profile(callback) {
  var startTime = Date.now();
  ret = callback();
  var endTime = Date.now();
  return {
    returnValue: ret,
    time: endTime - startTime
  };
}

benchmark({
  mapFilename: '64room_000.map',
  startX: 496,
  startY: 505,
  endX: 48,
  endY: 17,
  name: 'AStarFinder',
  finder: new PF.AStarFinder()
});
