/* jshint strict: true, undef: true */
/* globals spec, spec_returns, to_value, html_escape, DOMParser */


spec(html_unescape, ["&lt;p&gt;&#123;&#123;1&#125;&#125;&lt;/p&gt;"], '<p>{{1}}</p>');

spec_returns('<p>{{1}}</p>', function html_unescape_multiple_times() {
  "use strict";

  return to_value(
    '<p>{{1}}</p>',
    html_escape, html_escape, html_escape,
    html_unescape, html_unescape, html_unescape
  );
});

function html_unescape(raw) {
  "use strict";

  // From: http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
  return (new DOMParser().parseFromString(raw, "text/html"))
  .documentElement
  .textContent;
}
