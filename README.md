
dum\_dum\_html
==============

`cheerio` is used instead of `jsdom\jquery` because it is a lot
easier to use despite its incompatibility w/ jQuery.

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
