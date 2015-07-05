ospath
======

A JavaScript component that provides operating specific path values. Also
a replacement for https://github.com/jprichardson/node-path-extra.


Installation
------------

    npm i --save ospath


API
---

### ospath.data()

Returns the directory where an application should store its data directory.

- **Windows**: `%APPDATA%`
- **OS X**: `~/Library/Application Support`
- **Unix-like**: `$XDG_CONFIG_HOME` or `~/.config`


### ospath.home()

Returns the user's home directory.

- **Windows**: `%USERPROFILE%`
- **Unix-like**: `$HOME`


### ospath.tmp()

Returns a temporary directory. Could also use `require('os').tmpdir()`.

- **Windows**: `%TEMP%`
- **Unix-like**: `/tmp`


License
-------

MIT


