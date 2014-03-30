var Skiplist = require("./Skiplist")

function Item(val) {
  this.val = val;
}

var sl, x;

sl = new Skiplist(function (a,b) {
  return a.val - b.val;
});

if( !sl.empty() ){
  process.stdout.write("wrong. should be empty.\n")
  process.exit(1)
}
x = sl.Head.forward[0];
if(x != sl.Nil){
  process.stdout.write("wrong. Head.forward[0] != Nil\n")
  process.exit(1)
}

item3 = new Item(3);
item2 = new Item(2);
item_2 = new Item(2);
item1 = new Item(1);

sl.push(item3);
sl.push(item_2);
sl.push(item2);
sl.push(item1);

if(sl.length != 4){
  process.stdout.write("wrong size.\n")
  process.exit(1)
}

x = sl.Head.forward[0];
if(x.item != item1){
  process.stdout.write("wrong insert 1.\n")
  process.exit(1)
}
x = x.forward[0];
if(x.item != item2){
  process.stdout.write("wrong insert 2.\n")
  process.exit(1)
}
x = x.forward[0];
if(x.item != item_2){
  process.stdout.write("wrong insert _2.\n")
  process.exit(1)
}
x = x.forward[0];
if(x.item != item3){
  process.stdout.write("wrong insert 3.\n")
  process.exit(1)
}
x = x.forward[0];
if(x != sl.Nil){
  process.stdout.write("wrong insert nil.\n")
  process.exit(1)
}


sl.remove(item_2);
x = sl.Head.forward[0];
if(x.item != item1){
  process.stdout.write("wrong remove.\n")
  process.exit(1)
}
x = x.forward[0];
if(x.item != item2){
  process.stdout.write("wrong remove.\n")
  process.exit(1)
}
x = x.forward[0];
if(x.item != item3){
  process.stdout.write("wrong remove.\n")
  process.exit(1)
}

process.stdout.write("success!\n")
