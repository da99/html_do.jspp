
Don't use Dum\_Dum\_Boom\_Boom.
=================================

You should be using this instead (in order of awesomeness):
  * [Elm](http://elm-lang.org)
  * [RiotJS](https://muut.com/riotjs/)
  * [TypeScript](http://www.typescriptlang.org/)

Manuals:
===========

  * [Browser](./docs/BROWSER.md)
  * [NodeJS](./docs/NODEJS.md)
  * [HTML](./docs/HTML.md)
  * [Design](./docs/DESIGN.md)


Dependencies for the dum\_dum\_boom\_boom binary:
=================

* Bower
* NodeJS and NPM
* [mksh](https://www.mirbsd.org/mksh.htm) shell and [mksh_setup](https://github.com/da99/mksh_setup)
* [js\_setup](https://github.com/da99/js_setup)


Development:
=================

  1. Build and run specs: `dum_dum_boom_boom build`
  2. Adding a new function: add `exports.name =func_name;` for use in node.
  3. Directory layout:
     | lib/
       | browser/
         | dom/
       | node/
       | html/

