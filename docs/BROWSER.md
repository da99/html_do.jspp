
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

Use [js\_setup](https://github.com/da99/js_setup) to upgrade bower components.

*NOTE*: Use version numbers in `package.json`, and `latest` for bower.json.
The `latest` version only works with `bower`, not `npm`.  However, `js_setup upgrade`
upgrades both versions. It also notifies you if there are newer versions available.

