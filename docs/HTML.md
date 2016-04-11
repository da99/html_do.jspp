
Features:
======

  * `_.file.html` vs `file.html`
  * `{{MY}}` scoping
  * `locals`
  * `paste` and removing duplicate `script`, `meta`, `link` tags
  * concat/create/link `SCRIPT` tags to `script.js` file.
  * copy files (.css, .js, .png, etc) to output dir
  * locals:
    `<local name="name" value="value" />`
    `<local name="name">value</local>`



How HTML is processed:
==============

* NodeJS is used to take advantage of the popular Handlebars package.

* Uses `he`. Alternative encode/decode of html entities: https://github.com/substack/node-ent

* `cheerio` is used instead of `jsdom\jquery` because it is a lot
easier to use despite its incompatibility w/ jQuery.  [whacko](https://github.com/inikulin/whacko)
was considered, but it was harder to use when it came to
changing non-standard tags (e.g. `template` to `script` tags).

Specs
=====

```bash
  dum_dum_boom_boom test-html  # All specs.
  dum_dum_boom_boom test-html  lib/html/specs/my-dir-of-a-spec
```
