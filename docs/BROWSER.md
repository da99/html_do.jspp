
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

*NOTE*: The `browser.js` build contains all the require libs: `lodash`, `jquery`, etc.

`dum_dum_boom_boom` works by sending message (ie object) to a `server` like object: `App`:

```javascript
   App("send message", {"dom-change": true});
   App("send message", {"name": "Bruce Timm"});
```

This `server` like object holds state. Later, counters and other Redis-like functionality will
be added.

To add functionality, create a function to be executed:

```javascript
  App("create message function", function (msg) {
   if (!msg_match({"dom-change": true}, msg)
       return;
  });
```

Each message function gets run on every message. You can stop
execution of the function with an `if` and `return` on the messages you
do not want to process.  The function, `msg_match`, is provided to
let you compare the messages using an object that "looks like" the message
you want to process.


Pre-installed message functions:
============================

  * [data-do](https://github.com/da99/dum_dum_boom_boom/blob/master/lib/browser/data-do/_.bottom.js)

  This is the only message processing function. It is actually named `process_data_dos` inside
  the App object.  You associate DOM elements with the `data-do` attribute:

  ```html
    <div data-do="my_func with args;  my_other_func with other args; simply_my_func">Test</div>
  ```

  You can associate multiple functions by separating them with `;`. The "arguments" will be
  split on whitespace and pass to the function inside the message (ie object). For example:

  ```javascript
    function my_func(msg) {
      // msg is
      {
        on_dom: true,
        dom_id: dom_id_of_element, // auto-generated and assigned to element if element does not have one.
        args  : ["with", "args"]
      }
    }
  ```

  You can manipulate the message, but the changes won't be passed on to the other functions.
  The message is always a copy. If you want to propagate changes to the message, send it as
  a new message: `App('send message', my_new_message)`. This is intentionally restrictive to
  help create predictable functionality.

  Currently, there is no way to stop processing the message like you would in `Ruby Rack` or
  in event emitters. The need has not come up.

  Simplicity and power come from:

    * creating and sending message: `App('send message', {...})`
    * creating message processing functions: `App('create message function', function ({...}) {...})`
    * HTML that describes behaviour: `<div data-do="show is_hot ; ...`


Specs:
======

  1. Specs run in the browser if `window` and `#Spec_Stage` are defined.

  2. Use [js\_setup upgrade](https://github.com/da99/js_setup) to upgrade bower components.
      *NOTE*: Use version numbers in `package.json`, and `latest` for bower.json.
      The `latest` version only works with `bower`, not `npm`.  However, `js_setup upgrade`
      upgrades both versions. It also notifies you if there are newer versions available.

