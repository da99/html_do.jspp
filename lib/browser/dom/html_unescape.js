/* jshint strict: true, undef: true */
/* globals spec, spec, to_value, html_escape, DOMParser */


spec(html_unescape, ["&lt;p&gt;&#123;&#123;1&#125;&#125;&lt;/p&gt;"], '<p>{{1}}</p>');

spec('<p>{{1}}</p>', function html_unescape_multiple_times() {

  return to_value(
    '<p>{{1}}</p>',
    html_escape, html_escape, html_escape,
    html_unescape, html_unescape, html_unescape
  );
});

function html_unescape(raw) {

  // From: http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
  return (new DOMParser().parseFromString(raw, "text/html"))
  .documentElement
  .textContent;
}
