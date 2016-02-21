
dum\_dum\_html
==============

`cheerio` is used instead of `jsdom\jquery` because it is a lot
easier to use despite its incompatibility w/ jQuery.
`whacko` was considered, but it was harder to use when it came to
changing non-standard tags (e.g. `template`) to `script` tags.

Specs
=====

```bash
  dum_dum_html test
  dum_dum_html test spec/my_file.template.html
```

Create a `.template.html` file in specs:
```html

  <div>my input</div>

<!-- EXPECT: -->

  <div>my expected output</div>

```
Layout:
========

* /layouts
* /pages
* /snippets

Output Dir:
* /
  * page-name-of-file.html
  * page-name-of-file.markup.html (including head, tail, etc.)
  * page-name-of-file.style.css
  * page-name-of-file.script.css
  * snippet-name-of-file.html
  * snippet-name-of-file.markup.html (including head, tail, etc.)
  * snippet-name-of-file.style.css
  * snippet-name-of-file.script.css



Links:
=====

* Uses `he`. Alternative encode/decode of html entities: https://github.com/substack/node-ent


