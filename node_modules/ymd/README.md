ymd
===

JavaScript component to return the year, month, and day string. i.e. returns `YYYY-MM-dd` from Date object.


Why?
----

It's a one liner that I got tired of writing over and over again.

Here it is:

```javascript
function ymd (date) {
  return date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
}
```


Node.js/Browserify
------------------

    npm install --save ymd


Component
---------

    component install jprichardson/ymd


Methods
-------

### ymd

- returns using local timezone


### ymd.utc

- returns using UTC timezone


Example
------

```js
var ymd = require('ymd')

ymd.utc(new Date('2013-03-05')) //2013-03-05

// input to Date() is still being parsed as UTC, may be different for your timezone
ymd(new Date('2013-03-05 4:43 PM')) //2013-03-05
```


License
-------

(MIT License)

Copyright 2013, JP Richardson  <jprichardson@gmail.com>


