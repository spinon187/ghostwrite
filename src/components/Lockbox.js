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
  // if(typeof o === 'object'){
  //   const obj = {};
  //   Object.keys(o).forEach(x => obj[x] = CryptoJS.AES.encrypt(JSON.stringify(o[x]), k).toString());
  //   return obj
  // } else {
    return CryptoJS.AES.encrypt(o, k).toString();
  // }
}

export const decr = (o, k) => {
  // if(typeof o === 'object'){
  //   const obj = {};
  //   Object.keys(o).forEach(x => obj[x] = CryptoJS.AES.decrypt(o[x], k).toString(CryptoJS.enc.Utf8));
  //   return obj
  // } else {
    
    return CryptoJS.AES.decrypt(o, k).toString(CryptoJS.enc.Utf8);
  // }
}

// export const encr = (o, k) => {
//   o = JSON.stringify(o);
//   return CryptoJS.AES.encrypt(o, k).toString();
// }

// export const decr = (o, k) => {
//   return Crypto.AES.decrypt(o, k).toString(CryptoJS.enc.Utf8);
// }

// export default Lockbox;

const randomHexHack = () => {
    // let dic = {0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'A',11:'B',12:'C',13:'D',14:'E',15:'F'};
    // let hacked = '';
    // for(let i=0;i<64;i++){
    //   let val = Math.floor(Math.random()*16);
    //   hacked += dic[val]
    // }
    // return hacked;
    let num = new Uint32Array(8), arr = [];
    window.crypto.getRandomValues(num);
    num.forEach(n => arr.push(Number(n).toString(16)))
    return arr.join('').toUpperCase();
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

export const generateAliases = () => {
  let one = randomHexHack() + randomHexHack(), two = randomHexHack() + randomHexHack();
  // console.log(one, two)
  return [one, two];
}

export const testit = () => {
  // console.log(decr({to: "U2FsdGVkX1+eiKqeMrDopIBuHe6OYieyBLsaSPzub+A="}, "7eac0aede627a7055c93f1f6e9327ef26ba9ff3e3e74f7af5ecf6844128161eb8a6e22fa7842a2fd3cc3de344c561971dce33621e45524f9291032a9bd337fcfbdd243479991e6b3940dcd0be807d7bc674db69ede2ebd6b9db1446bbca1baeb92b8b29895d8efd432e8465d2712fecf33a0e169780704b2ef96465bbe79f92577bb5a7f092cab9d5f14bc9cabf769821d17a59300cf2d990ff7da479171988d35d7387b9389e807873f003ea2e3d7125f6a7a52cfb30955c343a8cb6aef8c785ce2ca3e2bab652a9286d90cb9e2c71dff1f59c28e9d2faad2209254ff61e0bf495c03b008ad439e3e996966dc11e8e323c1251bb66cfa5f3aec1849930f961b"))
  const key = "e6ac2e344e7e57b81b3b249627d4a4ad7ecd0a6790ec057184e033e221ad833d12d44e87e13b223269bd593b280715bee07ef95f7016629d6866ce8d58421e743bece54d0b51f6e144d64405b4e562c12a172ec1e3ed808b4f99fa5d93e2bd0842cbfaa2f84623b7a0ac0ec0a8a5642155eb9d2d55acf5dcf5339caf3256d7282439c68b7501f420b6dc3757b7ff83b63e69587fa04709f9f799025e37be092c479fabc3eda7453ee174c1095e1e6ca8ecf6a4b05d016870af2a122115f65fea293dbbabb2561259f95c6df173fd84a3fdae32af49eefc03fb59ecceb61f33a40d87e898d1944aae99b171db0d1528a3fc478fde536c9961942cb102f13cae0a"
  // const one = encr({to: "7975724538", from: '7975724538'},key)
  // const two = encr({to: "7975724538"},key);
  // const three = encr("7975724538",key);
  // console.log(one, two, three)
  
  // console.log(decr(one, key), decr(two, key), decr(three, key))
//   let num = new Uint32Array(8), arr = [];
// window.crypto.getRandomValues(num);
// num.forEach(n => arr.push(Number(n).toString(16)))
// arr = arr.join('')
// console.log(arr);
  // const v = encr("729F5A3CC87339F8CE3BF1C8683F709B21EEF0C19AB73FA265D1D79C1D6D322EE9D06FBCD41B2916B6D72F53A4528E686491B1EE80CBA1591A372925B18148",key)
  // console.log(v, decr(v,key));
}