
// Specification function:
function is_spec_env() {
  return is_localhost() && $('#Spec_Stage').length === 1;
}

// Specification function:
function spec_throws(f, args, expect) {
  if (!spec_new(f))
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));
  if (!_.isArray(args))
    throw new Error('Invalid value for args: ' + to_string(args));
  if (!_.isString(expect))
    throw new Error('Invalid valie for expect: ' + to_string(expect));

  spec_push(function () {
    var actual, err;
    var sig = to_function_string(f, args);

    try {
      f.apply(null, args);
    } catch (e) {
      err = e;
      actual = e.message;
    }

    var msg = to_match_string(actual, expect);

    if (!actual)
      throw new Error('!!! Failed to throw error: ' + sig + ' -> ' + expect);

    if (_.isEqual(actual, expect)) {
      log('=== Passed: ' + sig + ' -> ' + expect);
      return true;
    }

    log(err);
    throw new Error('Error message does not match: ' + to_string(actual) + ' !== ' + to_string(expect) );
  });
} // === function spec_throws

// Specification function:
function spec_returns(expect, f) {
  if (!spec_new(f))
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));

  if (l(f) === 0) {
    spec_push(function () {
      var sig = function_to_name(f);
      var actual = f();
      var msg = to_match_string(actual, expect);
      if (!_.isEqual(actual,expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg);
      log('=== Passed: ' + sig + ' -> ' + msg);
      return true;
    });
    return;
  } // if f.length === 0

  // === Async func:
  spec_push(function (fin) {
    var sig = function_to_name(f);
    f(function (actual) {
      var msg = to_match_string(actual, expect);
      if (!_.isEqual(actual,expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg);
      log('=== Passed: ' + sig + ' -> ' + msg);
      fin();
      return true;
    });
  });
} // === spec_returns

// Specification function:
// Accepts:
//   str_or_func : The function the spec is about.
function spec_new(str_or_func) {
  if (!is_spec_env())
    return false;

  // === Is there a specific spec to run?
  var href = window.location.href;
  var target = _.trim(href.split('?').pop() || '');
  if (!is_empty(target) && target !== href  && target !== function_to_name(str_or_func))
    return false;

  // === Reset DOM:
  spec_dom('reset');

  return true;
}

// Specification function:
// Accepts:
//   string : 'reset'  => Reset dom for next test.
function spec_dom(cmd) {

  switch (cmd) {
    case 'reset':
      var stage = $('#Spec_Stage');
      if (stage.length === 0)
        $('body').prepend('<div id="Spec_Stage"></div>');
      else
        stage.empty();
      break;

    default:
      if (arguments.length !== 0)
      throw new Error("Unknown value: " + to_string(arguments));
  } // === switch cmd

  return $('#Spec_Stage');
}

// Specification function:
//   Accepts:
//     f - function
//   Runs function (ie test) with all other tests
//   when spec_run is called.
function spec_push(f) {
  if (!is_spec_env())
    return false;
  if (!spec.specs)
    spec.specs = [];
  spec.specs = ([]).concat(spec.specs).concat([f]);
  return true;
}

function is_specs(specs) {
  should_be(specs, is_plain_object);
  should_be(specs.list, not(is_empty));
  should_be(specs.i, or(is('init'), is(0), is_positive));
  should_be(specs.dones, is_plain_object);
  return true;
}

function spec_next(specs) {
  should_be(specs, is_specs);

  if (specs.i === 'init') {
      specs.i = 0;
  } else {
    if (specs.dones[specs.i] !== true)
      throw new Error("Spec did not finish: " + to_string(specs.list[specs.i]));
    specs.i = specs.i + 1;
  }

  var i    = specs.i;
  var list = specs.list;
  var func = list[i];

  // === Are all specs finished?
  if (!func && i >= l(specs.list)) {
    specs.total = i;
    if (specs.total !== specs.list.length)
      throw new Error('Not all specs finished: ' + to_string(specs.total) + ' !== ' + to_string(specs.list.length));
    specs.on_finish(specs);
    return l(specs.list);
  }

  // === Function was found?
  if (!func) {
    throw new Error('Spec not found: ' + to_string(i));
  }

  // === Async?
  if (l(func) === 1 ) {
    setTimeout(function () {
      if (!specs.dones[i])
        throw new Error("Spec did not finish in time: " + to_string(func));
    }, 2500);
    func(function () {
      specs.dones[i] = true;
      spec_next(specs);
    });
    return false;
  }

  // === Regular spec, non-asyc?
  if (l(func) === 0) {
    func();
    specs.dones[i] = true;
    return spec_next(specs);
  }

  throw new Error('Function has invalid arguments: ' + to_string(func));
}

// === Arguments:
// spec_run()
// spec_run(function (msg) { log('Finished specs: ' + msg.total); })
//
// === Used by other functions to continue running specs:
// spec_run({
//    list: [],
//    i:"init"|0|positive,
//    on_finish: my_callback
// });
//
function spec_run() {
  if (!is_localhost())
    return false;

  var on_fin = arguments[0] || function (msg) {
    log('      ======================================');
    log('      Specs Finish: ' + to_string(msg.total) + ' tests');
    log('      ======================================');
  };

  if (!spec.specs || is_empty(spec.specs))
    throw new Error('No specs found.');

  return spec_next({
    i : 'init',
    list: spec.specs.slice(0),
    dones: {},
    on_finish: on_fin,
    total: 0
  });
} // function spec_run

// Specification function:
function spec(f, args, expect) {
  if (!spec_new(f))
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));

  if (arguments.length !== 3)
    throw new Error("arguments.length invalid for spec: " + to_string(arguments.length));

  spec_push(function () {
    var sig    = to_function_string(f, args);
    var actual = f.apply(null, args);
    var msg    = to_match_string(actual, expect);

    if (actual !== expect && !_.isEqual(actual, expect))
      throw new Error("!!! Failed: " + sig + ' -> ' + msg );

    log('=== Passed: ' + sig + ' -> ' + msg);
    return true;
  });
}
