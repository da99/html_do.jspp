
Don't use Dum\_Dum\_Boom\_Boom.
=================================

You should be using this instead (in order of awesomeness):
  * [Elm](http://elm-lang.org)
  * [RiotJS](https://muut.com/riotjs/)
  * [TypeScript](http://www.typescriptlang.org/)



Someone beat me to this:
=========================

[https://twitter.com/d0rc/status/685544307533545472](https://twitter.com/d0rc/status/685544307533545472)

![Example in erlang](./docs/CYJSUDfWcAU9dVQ.png?raw=true)

Message Standardization:
=======================

* `{ ok : true, ... }`
* `{ err: true, err_server|err_user: true, msg: "string", ... }`

Computer
========

Holds state. Mainly keeps track of array of functions that process messages.
There is no "name of message"/"type of message". This allows the functions
flexibility to handle messages and avoid creating a limiting/inflexible
DSL to associate messages w/functions.

```javascript
    computer('push', 'dom-change', my_func);
    computer('push', '!dom-change', my_func);
    computer('push', 'dom-change?', my_func);
    computer('run', {dom_change: true});
    // vs:
    computer('push', my_func_with_closure);
    computer('run', {dom_change: true});
```

Extremes:
=========

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


