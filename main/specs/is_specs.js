

function is_specs(specs) {
  should_be(specs, is_plain_object);
  should_be(specs.list, not(is_empty));
  should_be(specs.i, or(is('init'), is(0), is_positive));
  should_be(specs.dones, is_plain_object);
  return true;
}
