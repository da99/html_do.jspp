

  var log = function (_args) {
    var addr = window.location.href;
    if (
      addr.indexOf("localhost") == -1 &&
      addr.indexOf("file:///") == -1 &&
      addr.indexOf("127.0.0.1") == -1
     )
      return me;

    return console.log.apply(console, arguments);
  }; // === func

var App = function () {
  var me = this;
  me.stack = [];

  var to_string = function (val) {
    if (val === null)
      return "null";
    if (val === undefined)
      return "undefined";
    return val.toString();
  }; // === func

  me.log = function () {
    var stack = me.stack;
    if (stack.length < 1)
      throw new Error("Nothing on stack to log.");
    log(stack[stack.length - 1]);
    return me;
  };

  me.do = function (comment, func) {
    var stack = me.stack;

    if (typeof window[comment] === 'function') {
      var args = _.toArray(arguments);
      var name = args.shift();
      me.stack.push(window[name].apply(window[name], args));
      return me;
    }

    if (func.length === 0) {
      me.stack.push(func());
      return me;
    }

    var l = func.length;
    if (me.stack.length != l) {
      log(stack);
      throw new Error("Stack mismatch: " +
                      l.toString() +
                        " expected, but " +
                          me.stack.length +
                            " in stack " +
                              "for function: " + func.toString()
                     );
    }
    me.stack = [func.apply(null, me.stack)];
    return me;
  }; // === func

  me.push =function (validate, func) {
    var raw = _.isString(func) ? (new Function('return ' + func))() : func(me);
    if (!validate(raw))
      throw new Error("Invalid return: " + to_string(raw) + " from:" + func.toString());
    me.stack.push( raw );
    return me;
  };

  me.dot =function (validate, func_name, arg) {
    if (me.stack.length < 1)
      throw new Error("Stack underflow for: dot " + func_name.toString());

    var target = me.stack[me.stack.length - 1];
    var raw    = _.toArray(arguments).length > 2 ? target[func_name](arg) : target[func_name]();

    if (!validate(raw)) {
      throw new Error("Invalid return: dot " +
                      to_string(raw) +
                        " for: " + to_string(func_name));
    }
    me.stack.push( raw );
    return me;
  };

  me.on = function (func) {
    if (me.stack.length < 1)
      throw new Error("Stack undereflow.");

    var last = me.stack[me.stack.length - 1];
    if (!func(last))
      throw new Error("Failed: " + to_string(last) + " " + func.toString());
    return me;
  }; // === func

  me.map = function (validate, func) {
    if (me.stack.length < 1)
      throw new Error("Stack underflow for: map " + to_string(me.stack));
    var target = _.last(me.stack);
    var raw = _.map(target, func);
    if (!validate(raw))
      throw new Error('Invalid return on map: ' + to_string(raw));
    me.stack.push(raw);
    return me;

  };

  return me;
};

var length_of = function (num) { return function (v) { return v.length === num;};};
var length_gt = function (num) { return function (v) { return v.length > num;};};
var string    = function (v) { return typeof v === "string"; };
var app       = new App();
var all       = function (f) { return function (arr) { return _.all(arr, f); }; };

app
.push(length_of(1), '$("#p2")').log()
.dot(string, 'html').log()
.push(length_gt(0), '$("p")').log()
.map(all(string), function (v) { return $(v).html();}).log()
;




