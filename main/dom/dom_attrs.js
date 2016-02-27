

spec(dom_attrs, [$('<div id="000" img=".png"></div>')[0]], {id: "000", img: ".png"});
spec(dom_attrs, [$('<div class="is_happy"></div>')[0]], {"class": 'is_happy'});
function dom_attrs(dom) {
  arguments_are(arguments, has_property_of('attributes', 'object'));

  return _.reduce(
    dom.attributes,
    function (kv, o) {
      kv[o.name] = o.value;
      return kv;
    },
    {}
  );
} // === attrs
