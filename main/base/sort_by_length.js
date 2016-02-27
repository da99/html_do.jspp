



function sort_by_length(arr) {
  return arr.sort(function (a,b) {
    return length(a) - length(b);
  });
}
