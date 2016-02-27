

function spec_run() {
  let specs = (spec_push.specs || []);
  log('=== Running specs: ');
  for (var i = 0; i < specs.length; i++) {
    specs[i]();
  }
  if (specs.length === 0)
    throw new Error('No specs found.');
}
