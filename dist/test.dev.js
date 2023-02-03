"use strict";

function highest(arr) {
  var hashmap = arr.reduce(function (acc, val) {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(hashmap).reduce(function (a, b) {
    return hashmap[a] > hashmap[b] ? a : b;
  });
}

a = [0, 1, 2, 3, 4];
result = [];

var _loop = function _loop(i) {
  f = a.filter(function (x) {
    return x === a[i];
  }).length;
  result.push(f);
};

for (var i = 0; i < a.length; i++) {
  _loop(i);
}

the_same = false;

for (var _i = 0; _i < result.length; _i++) {
  if (result[_i] == 1) {
    the_same = true;
  }
}

console.log(the_same);