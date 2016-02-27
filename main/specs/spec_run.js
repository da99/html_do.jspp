

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
