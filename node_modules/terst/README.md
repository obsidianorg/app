terst
=====

[![build status](https://secure.travis-ci.org/jprichardson/terst.png)](http://travis-ci.org/jprichardson/terst)

A JavaScript testing component with a terse syntax. Supported in both Node.js and the browser.


Why?
----

Take a look at some of the popular JavaScript assertion/testing libraries, most of them are overly verbose.

examples from **[should.js](https://github.com/visionmedia/should.js/)** docs:

```js
var user = {
    name: 'tj'
  , pets: ['tobi', 'loki', 'jane', 'bandit']
};

user.should.have.property('name', 'tj');
user.should.have.property('pets').with.lengthOf(4);
```

or...

```js
T (user.name)
EQ (user.name, 'tj')
EQ (user.pets.length, 4)
```

how about from **[expect.js](https://github.com/LearnBoost/expect.js/)**:

```js
expect(window.r).to.be(undefined);
expect(5).to.be.a('number');
expect([]).to.be.an('array');
```

or..

```js
T (typeof window.r == 'undefined')
T (typeof 5 == 'number')
T (Array.isArray([]))
```

Don't even get me started on [Node.js assert](http://nodejs.org/api/assert.html).

Terst has three main advantages:

1. There are only six methods to remember. You aren't second guessing what each method really does or constantly referring to the documentation.
2. Your eyes can quickly scan down the left side of your tests to quickly interpret what each test should do. Terst forces you to be very explicit.
3. It's very lightweight.



Install
-------

### Node.js/Browserify

    npm install --save terst


### Component

    component install jprichardson/terst

### Script

```html
<script src="/path/to/terst.js"></script>
```



Methods
-------

### T (value, [msg])

Asserts if the value is truthy.


### F (value, [msg])

Asserts if the value is falsey.


### EQ (val1, val2, [msg])

Asserts if `val1` strictly equals `val2`.


### NEQ (val1, val2, [msg])

Asserts if `val` does not strictly equal `val2`.


### APPROX (value, expected, delta, [msg])

Asserts if the value is within +- the delta.

### THROWS (fun)

Asserts if a function throws i.e. if it does not throw, there is an error.



**NOTE:** For descriptive errors, you can set `terse.autoMsg = true`. It's experimental only.


License
-------

(MIT License)

Copyright 2013-2014, JP Richardson  <jprichardson@gmail.com>


