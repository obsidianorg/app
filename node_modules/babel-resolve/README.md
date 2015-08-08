babel-resolve
=============

Create a babel resolve function. This allows you to easily require your project's
local modules without passing in relative paths.


Install
-------

    npm i --save-dev babel-resolve


Usage
-----

```js
var babelResolve = require('babel-resolve')
var resolver = babelResolve('local/', './src/_local_modules')
require('babel/resolve')({resolve: resolver.resolve})
```

Now, in your program, you can import like:

```js
import mymodule from 'local/mymodule'
```

API
---

### create(prefix, dir)

`class` method that creates a resolver object that has methods `resolve()` and `mapKeys()`.

### resolve()

`instance` method that returns a function for `Babel` to resolve your modules.

### mapKeys(stubObject)

`instance` method that takes as input `stubObject` and returns a clone of it
with the keys replaced with `resolve(key)`. Useful for stubbing.


License
-------
MIT

Copyright (c) [JP Richardson][https://github.com/jprichardson]
