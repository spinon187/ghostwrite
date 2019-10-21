import {decr, secretize, generateAliases} from '../components/Lockbox';

//functions for the reducer to use

//array deletion helper
const del = (arr, targ) => {
  const iOfTarg = arr.indexOf(targ);
  arr.splice(iOfTarg, 1);
},

//following 3 functions used for message reception handling
msgReceived = (state, msg) => { //handles message reception
    const sk = state.keyring[msg.from].sk, decrypted = decr(msg.msg, sk);
    if(msg.nuke){ //this flag is a signal from your partner device to delete them
      del(state.myIds, msg.to);
      delete state.msgs[msg.from];
      delete state.keyring[msg.from];
      return state
    }
    if(!state.msgs[msg.from]){
      state.msgs[msg.from] = [];
    }
    state.msgs[msg.from].push({created: msg.created, msg: decrypted, me: false});
    state.keyring[msg.from].new++; //incrementing partner's unread message count
  return state
},

reqAccepted = (state, msg) => {
  //generates shared DH key and uses it to decrypt the ZK aliases
  const sk = secretize(msg.key, state.privKey), you = decr(msg.aliases[0], sk), me = decr(msg.aliases[1], sk);
  state.keyring[you] = {
    sk: sk,
    dummyID: msg.from, //number used for initial connection request, purely cosmetic at this point
    me: me, 
    new: 0 //unread messages
  };
  state.myIds.add(me); //adds new ZK alias to set for DB queries
  return state
},

reqReceived = (state, msg) => { //on receiving connection request, prepares data for use pending acceptance/rejection
  const sk = secretize(msg.key, state.privKey),
  aliases = generateAliases(sk), //generates ZK alias pair
  you = aliases[1], me = aliases[0]; //stores pair as self and partner
  state.conReqs[msg.from] = {from: msg.from, sk: sk, me: me, you: you}
  state.crCount++; //increments number of unresolved connection requests
  return state
},

//next two helper functions handle message sending
sendMsg = (state, msg) => { //adds own message to the parent partner object in the message store
  if(!state.msgs[msg.to]){
    state.msgs[msg.to] = {};
  }
  state.msgs[msg.to][msg.created] = {msg: msg.msg, me: true};
  return state
},

sendAccept = (state, msg) => { //grabs prepared data after acceptance and inserts it into the key store
  const data = state.conReqs[msg.to]
  state.keyring[data.you] = {
    sk: data.sk,
    dummyID: data.dummyID,
    me: data.me,
    new: 0
  };
  state.myIds.add(data.me)
  delete state.conReqs[msg.to]; //clears request from waiting list
  state.crCount--; //decrements the number of unresolved connection requests
  return state
}

export const rcvHandler = (state, msgs) => {
  let ns = {...state};
  msgs.forEach(msg => {
    ns =
      msg.accept
        ? reqAccepted(ns, msg)
      : msg.request
        ? reqReceived(ns, msg)
      : msgReceived(ns, msg)
  });
  return ns
},

sendHandler = (state, msg) => {
  let ns = {...state};
  return msg.accept
    ? sendAccept(ns, msg)
    : sendMsg(ns, msg)
},

clearWait = (state, target) => { //sets unread messages for partner to zero
  let ns = {...state}
  ns[target].new = 0;
  return ns;
},

clearConnect = (state, partner) => { //clears waiting data of rejected connection request
  let ns = {...state};
  delete ns.conReqs[partner];
  ns.crCount--;
  return ns
},

updateContact = (state, target, newDummy) => { //renames 10-digit ID to user's preferred input
  let ns = {...state};
  ns[target].dummyID = newDummy;
  return ns
},

targetNuke = (state, target) => { //deletes partner data from store as part of your own nuke request
  let ns = {...state};
  ns.myIds.delete(ns.keyring[target].me);
  delete ns.msgs[target];
  delete ns.keyring[target];
  return ns
}