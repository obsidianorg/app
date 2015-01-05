var sha256 = require('crypto-hashing').sha256;

var MessageBuilder = exports.MessageBuilder = function MessageBuilder() {
  this.buffer = new Buffer(10000);
  this.cursor = 0;
};
MessageBuilder.prototype.checksum = function checksum() {
  return new Buffer(sha256.x2(this.buffer.slice(0, this.cursor)));
};
MessageBuilder.prototype.raw = function raw() {
  var out = new Buffer(this.cursor);
  this.buffer.copy(out, 0, 0, this.cursor);
  return out;
};
MessageBuilder.prototype.pad = function pad(num) {
  var data = new Buffer(num);
  data.fill(0);
  return this.put(data);
};
MessageBuilder.prototype.put = function put(data) {
  if (typeof data == 'number' && data <= 255) {
    this.buffer[this.cursor] = data;
    this.cursor += 1;
    return this;
  }
  
  data.copy(this.buffer, this.cursor);
  this.cursor += data.length;
  return this;
};
MessageBuilder.prototype.putInt8 = function putInt8(num) {
  if (Buffer.isBuffer(num)) {
    return this.put(num.slice(0, 1));
  }
  return this.put(num);
}
MessageBuilder.prototype.putInt16 = function putInt16(num) {
  if (Buffer.isBuffer(num)) {
    return this.put(num.slice(0, 2));
  }
  var data = new Buffer(2);
  data.writeUInt16LE(num, 0);
  return this.put(data);
};
MessageBuilder.prototype.putInt32 = function putInt32(num) {
  if (Buffer.isBuffer(num)) {
    return this.put(num.slice(0, 4));
  } else if (typeof num.getMonth === 'function') {
    return this.putInt32(num.getTime()/1000); // Pull timestamp from Date object
  }
  var data = new Buffer(4);
  data.writeUInt32LE(num, 0);
  return this.put(data);
};
MessageBuilder.prototype.putInt64 = function putInt64(num) {
  if (Buffer.isBuffer(num)) {
    return this.put(num.slice(0, 8));
  } else if (typeof num.getMonth === 'function') {
    return this.putInt64(num.getTime()/1000); // Pull timestamp from Date object
  }
  // Pad a 32-bit number to fit in a 64-bit space
  var data = new Buffer(8);
  data.fill(0);
  data.writeUInt32LE(num, 0);
  return this.put(data);
};
MessageBuilder.prototype.putString = function putString(str) {
  var data = new Buffer(str.length);
  for(var i = 0; i < str.length; i++) {
    data[i] = str.charCodeAt(i);
  }
  return this.put(data);
};
MessageBuilder.prototype.putVarInt = function putVarInt(num) {
  if (num < 0xfd) {
    return this.put(num);
  } else if (num <= 0xffff) {
    return this.put(0xfd).putInt16(num);
  } else if (num <= 0xffffffff) {
    return this.put(0xfe).putInt32(num);
  } else {
    return this.put(0xff).putInt64(num);
  }
};
MessageBuilder.prototype.putVarString = function putVarString(str) {
  return this.putVarInt(str.length).putString(str);
};


var MessageParser = exports.MessageParser = function Struct(raw) {
  Object.defineProperty(this, 'buffer', {
    enumerable: true,
    value: new Buffer(raw.length)
  });
  raw.copy(this.buffer);
  
  this.pointer = 0;
  this.hasFailed = false;
};

MessageParser.prototype.pointerCheck = function pointerCheck(num) {
  num = +num || 0;
  if (this.buffer.length < this.pointer+num) {
    this.hasFailed = true;
    return false;
  }
};

MessageParser.prototype.incrPointer = function incrPointer(amount) {
  if (this.hasFailed) return false;
  this.pointer += amount;
  this.pointerCheck();
};

MessageParser.prototype.setPointer = function setPointer(amount) {
  if (this.hasFailed) return false;
  this.pointer = amount;
  this.pointerCheck();
};

MessageParser.prototype.readInt8 = function readInt8() {
  if (this.hasFailed || this.pointerCheck() === false) return false;
  var out = this.buffer[this.pointer];
  this.incrPointer(1);
  return out;
};

MessageParser.prototype.readUInt16LE = function readUInt16LE() {
  if (this.hasFailed || this.pointerCheck(2) === false) return false;
  var out = this.buffer.readUInt16LE(this.pointer);
  this.incrPointer(2);
  return out
};

MessageParser.prototype.readUInt32LE = function readUInt32LE() {
  if (this.hasFailed || this.pointerCheck(4) === false) return false;
  var out = this.buffer.readUInt32LE(this.pointer);
  this.incrPointer(4);
  return out
};

MessageParser.prototype.readVarInt = function readVarInt() {
  if (this.hasFailed || this.pointerCheck() === false) return false;
  var flag = this.readInt8();
  if (flag < 0xfd) {
    return flag;
  } else if (flag == 0xfd) {
    return this.readUInt16LE();
  } else if (flag == 0xfe) {
    return this.readUInt32LE();
  } else {
    return this.raw(8);
  }
};

MessageParser.prototype.readVarString = function readVarString() {
  if (this.hasFailed || this.pointerCheck() === false) return false;
  var length = this.readVarInt();
  var str = [];
  for (var i = 0; i < length; i++) {
    str.push(String.fromCharCode(this.readInt8()));
  }
  return str.join('');
}

MessageParser.prototype.raw = function raw(length) {
  if (this.hasFailed || this.pointerCheck(length) === false) return false;
  var out = new Buffer(length);
  this.buffer.copy(out, 0, this.pointer, this.pointer+length);
  this.incrPointer(length);
  return out;
}