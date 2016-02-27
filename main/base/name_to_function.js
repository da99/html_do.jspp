


spec(name_to_function, ["name_to_function"], name_to_function);
function name_to_function(raw) {
  /* globals window, global */
  if (!is_string(raw))
    throw new Error('Not a string: ' + to_string(raw));
  var str = _.trim(raw);
  if (typeof str !== 'function')
    throw new Error('Function not found: ' + to_string(raw));
  return (typeof 'window' !== 'undefined') ? window[str] : global[str];
}
