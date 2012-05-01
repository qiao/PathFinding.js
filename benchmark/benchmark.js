#!/usr/bin/env node

var colors    = require('colors');
var PF        = require('..');
var parseMap  = require('./parse_map').parse;
var parseScen = require('./parse_scen').parse;
var testCases = require('./test_cases');

function profile(callback) {
  var startTime = Date.now();
  ret = callback();
  var endTime = Date.now();
  return {
    returnValue: ret,
    time: endTime - startTime
  };
}

/**
 * @param {object} opt
 * @param {string} opt.header
 * @param {string} opt.footer
 * @param {PF.*Finder} opt.finder
 * @param {PF.Grid} opt.grid
 * @param {number} opt.startX
 * @param {number} opt.startY
 * @param {number} opt.endX
 * @param {number} opt.endY
 */
function benchmark(opt) {
  var result = profile(function() {
    return opt.finder.findPath(
      opt.startX,
      opt.startY,
      opt.endX,
      opt.endY,
      opt.grid
    );
  });
  var fields = [
    opt.header,
    (''+result.time + 'ms').yellow,
    'length' , formatFloat(PF.Util.pathLength(result.returnValue)),
    opt.footer,
  ];
  console.log(fields.join(' '));
}

function formatFloat(float) {
  return Math.round(float * 1000) / 1000;
}

function map2grid(map) {
  return new PF.Grid(map.width, map.height, map.grid);
}


testCases.forEach(function(test) {

  var grid = map2grid(parseMap(test.map));
  var scens = parseScen(test.scen).scenarios;
  var select = test.select;

  select.forEach(function(id) {

    var scen = scens[id];

    var result = benchmark({
      header: 'AStarFinder',
      finder: new PF.AStarFinder({allowDiagonal: true}),
      grid: grid,
      startX: scen.startX,
      startY: scen.startY,
      endX: scen.endX,
      endY: scen.endY,
      footer: '(optimal: '.grey + (''+scen.length).green + ')'.grey
    });

  });

});
