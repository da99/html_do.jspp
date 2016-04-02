
Don't use Dum\_Dum\_Boom\_Boom.
=================================

You should be using this instead (in order of awesomeness):
  * [Elm](http://elm-lang.org)
  * [RiotJS](https://muut.com/riotjs/)
  * [TypeScript](http://www.typescriptlang.org/)

Someone beat me to this: [https://twitter.com/d0rc/status/685544307533545472](https://twitter.com/d0rc/status/685544307533545472)
    ![Example in erlang](./docs/CYJSUDfWcAU9dVQ.png?raw=true)

Links:
=====
* Uses `he`. Alternative encode/decode of html entities: https://github.com/substack/node-ent

Current Design:
=================

MOPs - Message Oriented Pipelines - If you do not like this (or find
    it confusing) then just read about: 
Alan Kay's Real OOP, Erlang Process/Message/OTP, and biological systems.
MOPs is focused on experiments, recovering from those failed experiments,
     and flexibility. I should be able to create a Ruby Rack, Elixir Plug,
     or GUI-interaction system with just a few concepts.

![Message Oriented Pipelines](./docs/MOPs.png?raw=true)

Message Standardization:
=======================

* `{ ok : true, ... }`
* `{ err: true, err_server|err_user: true, msg: "string", ... }`

Browsers:
========================

```html
  <script src="/bower_components/dum_dum_boom_boom/build/browser.js"></script>

  <!-- on load -->
  <script>
    App('send message', {'dom-change': true});
  </script>
```

The `browser.js` build contains all the require libs: lodash, jquery, etc.

Use [js_setup](https://github.com/da99/js_setup) to upgrade bower components.

*NOTE*: Use version numbers in `package.json`, and `latest` for bower.json.


HTML
==============

`cheerio` is used instead of `jsdom\jquery` because it is a lot
easier to use despite its incompatibility w/ jQuery.
`whacko` was considered, but it was harder to use when it came to
changing non-standard tags (e.g. `template`) to `script` tags.

Layout for HTML:
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

Extremes:
=========

* Pipelines: server-side (data processing) + client-side (GUIs)
* Visualize GUI + prepare GUI elements
  * Associate functions to elements, run those functions
* State between functions
* Foms - before/after/on submit
* Mouse & keyboard events
* HTML -> JS (function)
* Toggles: bool -> function
* Logic as a value
  * Markup -> Logic Preview -> Templates
* Standardization of messages:
  * AJAX request/response -> message -> processed data structure
  * message -> processed data structure (inspiration Mustache)
  * processed data structure -> markup/view

Specs
=====

```bash
  dum_dum_boom_boom test
  dum_dum_boom_boom test spec/my_file.template.html
```

Create a `.template.html` file in specs:
```html

  <div>my input</div>

<!-- EXPECT: -->

  <div>my expected output</div>

```

1 - Previous designs:
==================
```javascript
    computer('push', 'dom-change', my_func);
    computer('push', '!dom-change', my_func);
    computer('push', 'dom-change?', my_func);
    computer('run', {dom_change: true});

    data-do="is_factor   my_func"
    data-do="is_factor?  my_func"
    data-do="my_func!    arg1 arg2"
    data-if="is_factor   my_func"
    data-key="is_factor  my_func"
```

The previous designs were prone to creating matching DSLs on messages.
Anytime you have to introduce mini-languages/DSLs and clever tricks, you are limiting
flexibility and creating future dead-ends. It adds more things to learn and more complexity
to the implementation of `dum_dum_boom_boom`.


2 - Previous design:
==============
Basically an array of functions. Each function
handles it's own message matching and allows for simplicity while adding flexibity.

```javascript
    data-do="my_func  arg1  arg2 ..."
    function my_func(msg) {
      if (!msg_match(pattern, msg))
        return;

      computer('push', function my_func_with_closure(msg) {
          if (!msg_match(my_other_pattern, msg))
            return;
      });
    }
    computer('run', {my_key: true});
```

There is no "name of message"/"type of message". This allows the functions
flexibility to handle messages and avoid creating a limiting/inflexible
DSL to associate messages w/functions.



