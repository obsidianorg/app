var Builder = require('../lib/Message').MessageBuilder;
var assert = require("assert")

describe('Builder', function() {
  var b = false;
  beforeEach(function() {
    b = new Builder();
  });
  it('should properly build raw bytes', function() {
    b.put(1).put(2).put(3);
    assert.equal(b.raw().toString('hex'), '010203');
  });
  it('should properly build raw Buffers', function() {
    b.put(new Buffer([1])).put(new Buffer([2])).put(new Buffer([3]));
    assert.equal(b.raw().toString('hex'), '010203');
  });
  it('should properly pad raw bytes', function() {
    b.put(1).pad(5).put(1);
    assert.equal(b.raw().toString('hex'), '01000000000001');
  });
  it('should properly build 8-bit ints', function() {
    b.putInt8(1).putInt8(2).putInt8(3);
    assert.equal(b.raw().toString('hex'), '010203');
  });
  it('should properly build 16-bit ints', function() {
    b.putInt16(1).putInt16(2).putInt16(3);
    assert.equal(b.raw().toString('hex'), '010002000300');
  });
  it('should properly build 32-bit ints', function() {
    b.putInt32(1).putInt32(2).putInt32(3);
    assert.equal(b.raw().toString('hex'), '010000000200000003000000');
  });
  it('should properly build strings', function() {
    b.putString('Hello');
    assert.equal(b.raw().toString('utf8'), 'Hello');
  });
  it('should properly add varInts', function() {
    b.putVarInt(0x50).putVarInt(0x1234).putVarInt(0xdeadbeef).putVarInt(new Buffer([1,2,3,4,5,6,7,8]));
    assert.equal(b.raw().toString('hex'), '50fd3412feefbeaddeff0102030405060708');
  });
  it('should properly add varStrings', function() {
    b.putVarString('Hello');
    assert.equal(b.raw().toString('hex'), '0548656c6c6f');
  });
});