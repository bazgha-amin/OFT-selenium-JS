const { Buffer } = require('buffer');

class CommonUtils{

  static generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * chars.length);
    result += chars[randIndex];
  }
  return result;
}

static getRandomEmail() {
  return CommonUtils.generateRandomString(6) + '@test.com';
}

static encodeDataBlob(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

static decodeDataBlobFromUrl(url) {
  const dataParam = new URL(url).searchParams.get('data');
  if (!dataParam) throw new Error("Data blob not found in URL");
  const decoded = JSON.parse(Buffer.from(dataParam, 'base64').toString('utf-8'));
  return decoded;
}

}
module.exports = CommonUtils;