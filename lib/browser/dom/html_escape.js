/* jshint strict: true, undef: true */
/* globals spec, _ */



spec(html_escape, ['<p>{{a}}</p>'], '&lt;p&gt;&#123;&#123;a&#125;&#125;&lt;/p&gt;');

function html_escape(str) {

  return _.escape(str).replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
}
