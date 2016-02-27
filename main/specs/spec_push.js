

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
