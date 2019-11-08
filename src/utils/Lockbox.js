import CryptoJS from 'crypto-js';
import BigNumber from 'bignumber.js';

//safe 2048-bit prime for DH generation... this is one long-ass number
let lan = new BigNumber('0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF');

export const encr = (target, key) => { 
  return CryptoJS.AES.encrypt(target, key).toString();
}

export const decr = (target, key) => {
  return CryptoJS.AES.decrypt(target, key).toString(CryptoJS.enc.Utf8);
}

const random256 = () => { //generates a random 256-bit integer for the private key
    let num = new Uint32Array(8), arr = [];
    window.crypto.getRandomValues(num);
    num.forEach(n => arr.push(Number(n).toString(16)))
    return arr.join('').toUpperCase();
  }

export const keyPair = () => { //generates public/private key pair
  let privKey = new BigNumber('0x' + random256());  
  let pubKey = new BigNumber('2').pow(privKey.toString(), [lan]);
  return [privKey.toString(16), pubKey.toString(16)];
}

export const secretize = (pubKey, privKey) => { //mixes own public key with partner's private key
  let priv = new BigNumber('0x'+privKey).toString();
  return new BigNumber('0x'+pubKey).pow(priv, [lan]).toString(16)
}

export const generateAliases = () => { //selects a pair of random 256 bit integers to use as ZK aliases
  let one = random256(), two = random256();
  return [one, two];
}