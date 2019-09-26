import CryptoJS from 'crypto-js';
require('dotenv').config();

// const key = `${process.env.KEY}` || '253D3FB468A0E24677C28A624BE0F939'

// export const encr = x => {
//   let z = CryptoJS.AES.encrypt(x, key).toString();
//   return z;
// }
// export const decr = y => {
//   let z = CryptoJS.AES.decrypt(y, key);
//   return z.toString(CryptoJS.enc.Utf8)
// }

export default class Lockbox {
  
  encr = (o, k) => {
    o = JSON.stringify(o);
    return CryptoJS.AES.encrypt(o, k).toString();
  }

  decr = (o, k) => {
    return Crypto.AES.decrypt(o, k).toString(CryptoJS.enc.Utf8);
  }
}