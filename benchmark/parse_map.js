#!/usr/bin/env node

/**
 * Convert the `map` files into json
 * 
 * All maps begin with the lines:
 * 
 *     type octile
 *     height x
 *     width y
 *     map
 * 
 * where x and y are the repsective height and width of the map.
 * 
 * The map data is store as an ASCII grid. The following characters are possible:
 * 
 *     . - passable terrain
 *     G - passable terrain
 *     @ - out of bounds
 *     O - out of bounds
 *     T - trees (unpassable)
 *     S - swamp (passable from regular terrain)
 *     W - water (traversable, but not passable from terrain)
 * 
 */

/**
 * Implementation note:
 * For convenience, only '.' and 'G' are interpreted as walkable.
 */

var fs = require('fs');
var endOfLine = require('os').EOL;

function parse(filename) {
  var content = fs.readFileSync(filename).toString();
  var lines = content.split(endOfLine);
  return {
    height : parseInt(lines[1].split(' ')[1]),
    width  : parseInt(lines[2].split(' ')[1]),
    grid   : parseGrid(lines.slice(4)),
  };
}
exports.parse = parse;

function parseGrid(lines) {
  var grid = [];
  lines.forEach(function(line) {
    if (!line.length) {
      return;
    }
    var row = [];
    line.split('').forEach(function(char) {
      row.push(char in { '.': 1, 'G': 1 } ? 0 : 1);
    });
    grid.push(row);
  });
  return grid;
}

function splitext(filename) {
  var index = filename.lastIndexOf('.');
  if (index < 0) {
    return [filename, ''];
  } else {
    return [filename.substr(0, index), filename.substr(index)];
  }
}

function main(argv) {
  var filename = argv[2];
  var obj = parse(filename);
  var root = splitext(filename)[0];
  fs.writeFileSync(root + '.json', JSON.stringify(obj));
}

if (!module.parent) {
  main(process.argv);
}
