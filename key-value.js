const kvs = require('keyvalue-xyz');
const { promisify } = require('util');

class ShortURL {
  constructor(key) {
    this.KEY = key;
  }

  async createToken() {
    return await promisify(kvs.createToken)(this.KEY);
  }

  async getValue(token) {
    return await promisify(kvs.getValueForKey)(token, this.KEY);
  }

  async setValue(token, value) {
    return await promisify(kvs.setValueForKey)(token, this.KEY, value);
  }
}

// const createToken = async () => {
//   return await promisify(kvs.createToken)(KEY);
// }
//
// const getValue = async (token) => {
//   return await promisify(kvs.getValueForKey)(token, KEY);
// }
//
// const setValue = async (token, value) => {
//   return await promisify(kvs.setValueForKey)(token, KEY, value);
// }

module.exports = ShortURL;
