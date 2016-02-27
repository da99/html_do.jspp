


function spec_push(f) {
  if (!spec_push.specs) spec_push.specs = [];
  spec_push.specs.push(f);
  return true;
}
