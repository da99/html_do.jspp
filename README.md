
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
