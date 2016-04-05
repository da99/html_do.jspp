
Note:
======
* Uses `he`. Alternative encode/decode of html entities: https://github.com/substack/node-ent



How HTML is processed:
==============

NodeJS is used to take advantage of the popular Handlebars package.

`cheerio` is used instead of `jsdom\jquery` because it is a lot
easier to use despite its incompatibility w/ jQuery.  `whacko`
was considered, but it was harder to use when it came to
changing non-standard tags (e.g. `template`) to `script` tags.

Specs
=====

```bash
  dum_dum_boom_boom html lib/html/specs/my_file.template.html
```
