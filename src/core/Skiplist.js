/**
@brief
  SkipNode is the nodes used in this skiplist implementation
@param
  level: level of forward array
  item: the item being stored in skiplist
 */
function SkipNode(level, item) {
  if(item != null){
    this.item = item;
  }
  if(level != null){
    this.forward = new Array(level);
    this.backward = new Array(level);
  }
};

var defaultCmp = function(x, y) {
  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
};

/**
@param
  cmp: Comparing function of two custom nodes
  maxLevel: The maximum level in this skiplist.
          The higher, the better finding time but the more space consumption.
  P: The probability of setting level for new nodes.
      The smaller it is, the easier it gets to the maximum level.
 */
function Skiplist(cmp, maxLevel, P) {
  this.maxLevel = maxLevel != null? maxLevel: 16;
  this.P = P != null? P: 0.5 ;
  this.cmp = cmp != null ? cmp: defaultCmp;

  this.Head = new SkipNode(this.maxLevel);
  this.Nil = new SkipNode(this.maxLevel);
  this.length = 0;
  this.levelCeil = 0;

  for (var i=0; i < this.maxLevel; ++i) {
    this.Head.forward[i] = this.Nil;
    this.Nil.backward[i] = this.Head;
  }
};


Skiplist.prototype.empty = function () {
  return this.length == 0;
};

// item must be an object and leave the field '_slprev' for this module use
Skiplist.prototype.insert = function (item) {
  this.length ++;

  var x = this.Head;
  var slprev = new Array(this.maxLevel);

  for (var i = this.levelCeil - 1 ; i >= 0; --i) {
    while(x.forward[i] != this.Nil && this.cmp(x.forward[i].item, item) < 0 ) {
      x = x.forward[i];
    }
    slprev[i] = x;
  }

  // we allow duplicates. So just insert it
  var level = this.randomLevel();
  if(level > this.levelCeil){
    for (var i = this.levelCeil ; i < level; ++i) {
      slprev[i] = this.Head;
    }
    this.levelCeil = level;
  }

  x = new SkipNode(level, item);
  for (var i=0; i < level; ++i) {
    x.forward[i] = slprev[i].forward[i];
    x.forward[i].backward[i] = x;
    slprev[i].forward[i] = x;
    x.backward[i] = slprev[i];
  }

  item._skipnode = x;
};

// the item must be inserted before
// O(1) remove operation
Skiplist.prototype.remove = function (item) {
  var x = item._skipnode;

  var fw_height = x.forward.length;

  var prev, next;
  for (var i=0; i < fw_height; ++i) {
    prev = x.backward[i];
    next = x.forward[i];
    prev.forward[i] = next;
    next.backward[i] = prev;
  }

  while(this.levelCeil > 0
        && this.Head.forward[this.levelCeil - 1] == this.Nil){
    this.levelCeil --;
  }

  this.length --;
};

Skiplist.prototype.push = Skiplist.prototype.insert ;

Skiplist.prototype.pop = function () {
  var res = this.Head.forward[0];
  this.remove(res.item)
  return res.item;
};

Skiplist.prototype.randomLevel = function () {
  var level = 1;
  while( level < this.maxLevel
        && Math.random() < this.P){
    level ++;
  }
  return level
}

module.exports = Skiplist;
