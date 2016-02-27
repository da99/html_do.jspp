

// Specification function:
function is_spec_env() {
  return is_localhost() && $('#Spec_Stage').length === 1;
}
