

// it 'returns an Array when passed a String'
spec(node_array, ['<div id="111" show_if="happy?"><span></span></div>'], [
  {
    tag:   'DIV',
    attrs:  {id: '111', show_if: 'happy?'},
    custom: {},
    childs: [
      {tag: 'SPAN', attrs: {}, custom: {}, childs: []}
    ]
  }
]);

spec_returns(['a', undefined, 'b'], function node_array_returns_raw_text_nodes() {
  var arr = node_array('<div><span>a<span></span>b</span></div>');
  return _.pluck(arr[0].childs[0].childs, 'nodeValue');
});
function node_array(unknown) {
  var arr = [];
  _.each($(unknown), function (dom) {
    if (dom.nodeType !== 1)
      return arr.push(dom);

    arr.push({
      tag    : dom.nodeName,
      attrs  : dom_attrs(dom),
      custom : {},
      childs : node_array($(dom).contents())
    });
  });

  return arr;
}
