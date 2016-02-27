


// Examples:
//
//   .new_id()           ->  Integer
//   .new_id('prefix_')  ->  String
//
function new_id(prefix) {
  if (!new_id.hasOwnProperty('_id'))
    new_id._id = -1;
  new_id._id = new_id._id + 1;
  return (prefix) ? prefix + new_id._id : new_id._id;
} // === func
