import CryptoJS from 'crypto-js';
import BigNumber from 'bignumber.js';


// export const keyPair = () => {
//   let secret = Math.floor((Math.random()*1451) + 1).toString();
//   let bigboy = new BigNumber('2').pow(secret).mod(2903);
//   return [secret, bigboy.toString()]
// }
  
// export const secretize = (pub, pri) => {
//   return new BigNumber(pub).pow(pri).mod(2903)
// }

let lan = new BigNumber('0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF');

export const encr = (o, k) => {
  const obj = {}
  Object.keys(o).forEach(x => obj[x] = CryptoJS.AES.encrypt(JSON.stringify(o[x]), k).toString())
  return obj;
}

export const decr = (o, k) => {
  const obj = {}
  Object.keys(o).forEach(x => obj[x] = Crypto.AES.decrypt(o[x], k).toString(CryptoJS.enc.Utf8));
  return obj;
}

// export default Lockbox;

const randomHexHack = () => {
    let dic = {0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'A',11:'B',12:'C',13:'D',14:'E',15:'F'};
    let hacked = '';
    for(let i=0;i<64;i++){
      let val = Math.floor(Math.random()*16);
      hacked += dic[val]
    }
    return hacked;
  }

export const keyPair = () => {
  let privKey = new BigNumber('0x' + randomHexHack());  
  let pubKey = new BigNumber('2').pow(privKey.toString(), [lan]);
  return [privKey.toString(16), pubKey.toString(16)];
}

export const secretize = (pubKey, privKey) => {
  let priv = new BigNumber('0x'+privKey).toString();
  return new BigNumber('0x'+pubKey).pow(priv, [lan]).toString(16)
}

// export const testit = () => {
//   let pair1 = keyPair();
//   console.log('pair1:'+pair1)
//   let pair2 = keyPair();
//   console.log('pair2:'+pair2)
//   let test1 = secretize(pair1[1],pair2[0]);
//   let test2 = secretize(pair2[1],pair1[0]);
//   console.log('test1:' + test1);
//   console.log('test2:' + test2);
// }