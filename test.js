var assert = require('assert');
var equal = require('./index');

function eq(a, b) {
  assert.ok(equal(a, b).result);
}

function ne(a, b) {
  assert.ok(!equal(a, b).result);
}

/* 1. simple tests */

/* 1.1. positive */
exports["NaN eqs NaN"] = function() {
  return eq(NaN, NaN);
};
exports["finite integer n eqs n"] = function() {
  return eq(1234, 1234);
};
exports["emtpy list eqs empty list"] = function() {
  return eq([], []);
};
exports["emtpy obj eqs empty obj"] = function() {
  return eq({}, {});
};
exports["number eqs number of same value"] = function() {
  return eq(123.45678, 123.45678);
};
exports["regex lit's w same pattern, flags are eq"] = function() {
  return eq(/^abc[a-zA-Z]/, /^abc[a-zA-Z]/);
};
exports["pods w same properties are eq"] = function() {
  return eq({
    a: 'b',
    c: 'd'
  }, {
    a: 'b',
    c: 'd'
  });
};
exports["pods that only differ wrt prop ord are eq"] = function() {
  return eq({
    a: 'b',
    c: 'd'
  }, {
    c: 'd',
    a: 'b'
  });
};

/* 1.2. negative */
exports["obj doesn't eq list"] = function() {
  return ne({}, []);
};
exports["obj in a list doesn't eq list in list"] = function() {
  return ne([{}], [[]]);
};
exports["integer n doesn't eq rpr n"] = function() {
  return ne(1234, '1234');
};
exports["integer n doesn't eq n + 1"] = function() {
  return ne(1234, 1235);
};
exports["empty list doesn't eq false"] = function() {
  return ne([], false);
};
exports["list w an integer doesn't eq one w rpr n"] = function() {
  return ne([3], ['3']);
};
exports["regex lit's w diff. patterns, same flags aren't eq"] = function() {
  return ne(/^abc[a-zA-Z]/, /^abc[a-zA-Z]x/);
};
exports["regex lit's w same patterns, diff. flags aren't eq"] = function() {
  return ne(/^abc[a-zA-Z]/, /^abc[a-zA-Z]/i);
};
exports["+0 should ne -0"] = function() {
  return ne(+0, -0);
};
exports["number obj not eqs primitive number of same value"] = function() {
  return ne(5, new Number(5));
};
exports["string obj not eqs primitive string of same value"] = function() {
  return ne('helo', new String('helo'));
};
exports["(1) bool obj not eqs primitive bool of same value"] = function() {
  return ne(false, new Boolean(false));
};
exports["(2) bool obj not eqs primitive bool of same value"] = function() {
  return ne(true, new Boolean(true));
};
exports["number obj eqs the same valued number object"] = function() {
  return eq(new Number(5), new Number(5));
};

/* 2. complex tests */
exports["obj w undef member not eqs other obj w/out same member"] = function() {
  var d, e;
  d = {
    x: void 0
  };
  e = {};
  return ne(d, e);
};
exports["fn1: functions w same source are eq"] = function() {
  var d, e;
  d = function( a, b, c ){ return a * b * c; };
  e = function( a, b, c ){ return a * b * c; };
  return eq(d, e);
};
exports["fn2: functions w diff source aren't eq"] = function() {
  var d, e;
  d = function( a, b, c ){ return a * b * c; };
  e = function( a, b, c ){ return a  *  b  *  c; };
  return ne(d, e);
};
exports["fn3: equal functions w equal props are eq"] = function() {
  var d, e;
  d = function() {
    return null;
  };
  d.foo = {
    some: 'meaningless',
    properties: 'here'
  };
  e = function() {
    return null;
  };
  e.foo = {
    some: 'meaningless',
    properties: 'here'
  };
  return eq(d, e);
};
exports["fn4: equal functions w unequal props aren't eq"] = function() {
  var d, e;
  d = function() {
    return null;
  };
  d.foo = {
    some: 'meaningless',
    properties: 'here'
  };
  e = function() {
    return null;
  };
  e.foo = {
    some: 'meaningless',
    properties: 'here!!!'
  };
  return ne(d, e);
};
exports["list w named member eqs other list w same member"] = function() {
  var d, e;
  d = ['foo', null, 3];
  d['extra'] = 42;
  e = ['foo', null, 3];
  e['extra'] = 42;
  return eq(d, e);
};
exports["list w named member doesn't eq list w same member, other value"] = function() {
  var d, e;
  d = ['foo', null, 3];
  d['extra'] = 42;
  e = ['foo', null, 3];
  e['extra'] = 108;
  return ne(d, e);
};
exports["date eqs other date pointing to same time"] = function() {
  var d, e;
  d = new Date("1995-12-17T03:24:00");
  e = new Date("1995-12-17T03:24:00");
  return eq(d, e);
};
exports["date does not eq other date pointing to other time"] = function() {
  var d, e;
  d = new Date("1995-12-17T03:24:00");
  e = new Date("1995-12-17T03:24:01");
  return ne(d, e);
};
exports["str obj w props eq same str, same props"] = function() {
  var d, e;
  d = new String("helo test");
  d['abc'] = 42;
  e = new String("helo test");
  e['abc'] = 42;
  return eq(d, e);
};
exports["str obj w props not eq same str, other props"] = function() {
  var d, e;
  d = new String("helo test");
  d['abc'] = 42;
  e = new String("helo test");
  e['def'] = 42;
  return ne(d, e);
};
exports["str obj w props eq same str, same props (circ)"] = function() {
  var c, d, e;
  c = ['a list'];
  c.push(c);
  d = new String("helo test");
  d['abc'] = c;
  e = new String("helo test");
  e['abc'] = c;
  return eq(d, e);
};
exports["str obj w props not eq same str, other props (circ)"] = function() {
  var c, d, e;
  c = ['a list'];
  c.push(c);
  d = new String("helo test");
  d['abc'] = c;
  e = new String("helo test");
  e['def'] = c;
  return ne(d, e);
};
/*exports["(1) circ arrays w similar layout, same values aren't eq"] = function() {
  var d, e;
  d = [1, 2, 3];
  d.push(d);
  e = [1, 2, 3];
  e.push(d);
  return ne(d, e);
};*/
exports["(2) circ arrays w same layout, same values are eq"] = function() {
  var d, e;
  d = [1, 2, 3];
  d.push(d);
  e = [1, 2, 3];
  e.push(e);
  return eq(d, e);
};
exports["(fkling1) arrays w eq subarrays are eq"] = function() {
  var a, b, bar, foo;
  a = [1, 2, 3];
  b = [1, 2, 3];
  foo = [a, a];
  bar = [b, b];
  return eq(foo, bar);
};
/*exports["(fkling2) arrays w eq subarrays but diff distribution aren't eq"] = function() {
  var a, b, bar, foo;
  a = [1, 2, 3];
  b = [1, 2, 3];
  foo = [a, a];
  bar = [a, b];
  return ne(foo, bar);
};*/

/* joshwilsdon's test (https://github.com/joyent/node/issues/7161) */
exports["joshwilsdon"] = function() {
  var count, d1, d2, errors, idx1, idx2, v1, v2, _i, _j, _len, _ref;
  d1 = [
    NaN, void 0, null, true, false, Infinity, 0, 1, "a", "b", {
      a: 1
    }, {
      a: "a"
    }, [
      {
        a: 1
      }
    ], [
      {
        a: true
      }
    ], {
      a: 1,
      b: 2
    }, [1, 2], [1, 2, 3], {
      a: "1"
    }, {
      a: "1",
      b: "2"
    }
  ];
  d2 = [
    NaN, void 0, null, true, false, Infinity, 0, 1, "a", "b", {
      a: 1
    }, {
      a: "a"
    }, [
      {
        a: 1
      }
    ], [
      {
        a: true
      }
    ], {
      a: 1,
      b: 2
    }, [1, 2], [1, 2, 3], {
      a: "1"
    }, {
      a: "1",
      b: "2"
    }
  ];
  errors = [];
  count = 0;
  for (idx1 = _i = 0, _len = d1.length; _i < _len; idx1 = ++_i) {
    v1 = d1[idx1];
    for (idx2 = _j = idx1, _ref = d2.length; idx1 <= _ref ? _j < _ref : _j > _ref; idx2 = idx1 <= _ref ? ++_j : --_j) {
      count += 1;
      v2 = d2[idx2];
      if (idx1 === idx2) {
        if (!eq(v1, v2)) {
          //errors.push("eq " + (rpr(v1)) + ", " + (rpr(v2)));
        }
      } else {
        if (!ne(v1, v2)) {
          //errors.push("ne " + (rpr(v1)) + ", " + (rpr(v2)));
        }
      }
    }
  }
  return [count, errors];
};

exports['node buffer'] = function() {
  eq(new Buffer('abc'), new Buffer('abc'));
  ne(new Buffer('abc'), new Buffer('abc1'));
  ne(new Buffer('abd'), new Buffer('abc'));
};


exports['RegExp with props'] = function() {
  var re1 = /a/;
  re1.lastIndex = 3;
  ne(re1, /a/);
};

exports['Date with props'] = function() {
  var now = Date.now();

  var d1 = new Date(now);
  var d2 = new Date(now);

  d1.a = 10;

  ne(d1, d2);
};

exports['Check object prototypes'] = function() {
  var nbRoot = {
    toString: function() { return this.first + ' ' + this.last; }
  };

  function nameBuilder(first, last) {
    this.first = first;
    this.last = last;
    return this;
  }
  nameBuilder.prototype = nbRoot;

  function nameBuilder2(first, last) {
    this.first = first;
    this.last = last;
    return this;
  }
  nameBuilder2.prototype = nbRoot;

  var nb1 = new nameBuilder('Ryan', 'Dahl');
  var nb2 = new nameBuilder2('Ryan', 'Dahl');

  eq(nb1, nb2);

  nameBuilder2.prototype = Object;
  nb2 = new nameBuilder2('Ryan', 'Dahl');

  ne(nb1, nb2);
};