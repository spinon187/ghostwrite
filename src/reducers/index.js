import {
  REGGING,REGGED,REG_FAIL,SENDING,SENT,SEND_FAIL,RETRIEVING,RETRIEVED,RET_FAIL,CHECKING,
CHECKED,CHECK_FAIL,FULL_NUKED,FULL_NUKING,TAR_NUKING,TAR_NUKED,NUKE_FAIL,CLEAR,SELF_NUKE,KEYING,KEYED,KEY_FAIL,CONNECTING,CONNECTED,CONNECT_FAIL,CONNECT_SENDING,CONNECT_SENT,CS_FAIL,DECLINE
} from '../actions/index';
import {keyPair, secretize, decr, generateAliases} from '../components/Lockbox';

const initialState = {
  error: null,
  regging: false,
  regged: null,
  auth: null,
  sending: false,
  retrieving: false,
  waiting: {},
  msgs: {},
  keyring: {},
  keying: false,
  pubKey: null,
  privKey: null,
  nuking: false,
  checking: false,
  checked: false,
  uid: null,
  connecting: false,
  connections: {},
  toKey: []
};



const connections = (state, connections) => {
  let temp = state, keyring = state.keyring, priv = state.privKey, cons = state.connections, waiting = state.waiting; 
  connections.forEach(con => {
      if(con.accept === true){
        decr(con.aliases[0], secretize(con.key, priv)).then(you => {
          decr(con.aliases[1], secretize(con.key, priv)).then(me => {
            keyring[you] = [secretize(con.key, priv), con.from, me];
            waiting[you] = [con.from, 0];
          })
        })
      }
      else if(con.request === true){
        generateAliases(secretize(con.key, priv)).then(aliases => {
          const you = aliases[1], me = aliases[0];
          cons[con.from] = {from: con.from, key: secretize(con.key, priv), aliases: aliases, me: me, you: you}
        })
      }
  })
  return {...temp, keyring: keyring, connections: cons, connecting: false, waiting: waiting}
}

const acceptConnect = (state, partner) => {
  let temp = state.connections, keyring = state.keyring, obj = temp[partner], waiting = state.waiting;
  if(obj){
    keyring[obj.aliases[1]] = [obj.key, obj.from, obj.aliases[0]];
    waiting[obj.aliases[1]] = [obj.from, 0];
    delete temp[partner]
  };

  return {...state, sending: false, connecting: false, keyring: keyring, connections: temp, waiting: waiting}
}

const clearConnect = (state, partner) => {
  let temp = state.connections;
  if(temp[partner]) delete temp[partner];
  return temp
}

const addMsgs = (state, msgs, direction) => {
  let ret = state, temp = state.msgs, toNuke = [], keyring = state.keyring;
  if(direction === 'in'){
    msgs.forEach(msg => {
      let key = keyring[msg.from][0], decrypted = decr(msg.msg, key);
      if(msg.nuke === true){
        toNuke.push(msg.from);
      }
      if(!temp[msg.from]){
        temp[msg.from] = {};
      }
      temp[msg.from][msg.created] = decrypted
    })
  }
  else{
    let key = keyring[msgs.to][0], decrypted = decr(msgs.msg, key);
    if(!temp[msgs.to]){
      temp[msgs.to] = {};
    }
    temp[msgs.to][msgs.created] = decrypted
  }
  if(toNuke.length > 0){
    toNuke.forEach(target => {
      delete temp[target];
      delete ret.waiting[target];
    })
  }
  return {...ret, msgs: temp, retrieving: false, keyring: keyring};
}

const waitlist = (state, counts) => {
  let temp = state.waiting;
  if(Object.keys(counts).length > 0){
    Object.keys(counts).forEach(id =>{
      temp[id][1] = temp[id][1] ? temp[id][1] + counts[id] : counts[id][1]
    })
  }
  return temp;
}

const targetNuke = (state, target) => {
  let temp1 = state.msgs, temp2 = state.waiting;
  delete temp1[target];
  delete temp2[target];
  return {msgs: temp1, waiting: temp2};
}

const clearWait = (state, partner) => {
  let temp = state.waiting;
  temp[partner] = 0;
  return temp;
}


export const rootReducer = (state = initialState, action) => {
  switch(action.type) {
    case REGGING:
      return {
        ...state,
        regging: true
      }
    case REGGED:
      const keys = keyPair();
      return {
        ...state,
        regging: false,
        regged: action.payload.reg,
        uid: action.payload.uid,
        auth: action.payload.serverToken,
        privKey: keys[0],
        pubKey: keys[1]
      }
    case REG_FAIL:
      return {
        ...state,
        regging: false,
        regged: false,
        error: action.payload
      }
    case SENDING:
      return {
        ...state,
        sending: true,
      }
    case SENT:
      return addMsgs(state, action.payload, 'out')
    case SEND_FAIL:
      return {
        ...state,
        sending: false,
        error: action.payload
      }
    case RETRIEVING:
      return {
        ...state,
        retrieving: true
      }
    case RETRIEVED:
      return addMsgs(state, action.payload, 'in')
    case RET_FAIL:
      return {
        ...state,
        retrieving: false,
        error: action.payload
      }
    case CHECKING:
      return {
        ...state,
        checking: true,
      }
    case CHECKED:
      return {
        ...state,
        checking: false,
        checked: true,
        waiting: waitlist(state, action.payload)
      }
    case CHECK_FAIL:
      return {
        ...state,
        checking: false,
        checked: false,
        error: action.payload
      }
    case FULL_NUKING:
      return {
        ...state,
        nuking: true
      }
    case FULL_NUKED:
      return {
        initialState
      }
    case TAR_NUKING:
      return {
        ...state,
        nuking: true
      }
    case TAR_NUKED:
      const {msgs, waiting} = targetNuke(state, action.payload);
      return {
        ...state,
        msgs: msgs,
        waiting: waiting,
        nuking: false
      }
    case NUKE_FAIL:
      return {
        ...state,
        nuking: false,
        error: action.payload
      }
    case CLEAR:
      return {
        ...state,
        waiting: clearWait(state, action.payload)
      }
    case SELF_NUKE:
      const {msgsS, waitingS} = targetNuke(state, action.payload);
      return {
        ...state,
        msgs: msgsS,
        waiting: waitingS,
        nuking: false
      }
    case KEYED:
      let tag = action.payload[0], tempring = state.keyring;
      tempring[tag] = [action.payload[1], action.payload[2], action.payload[3]];
      return {
        ...state,
        keying: false,
        keyring: tempring
      }
    case KEYING:
      return {
        ...state,
        keying: true
      }
    case KEY_FAIL:
      return {
        ...state,
        keying: false,
        error: action.payload
      }
    case CONNECTING:
      return {
        ...state,
        connecting: true
      }
    case CONNECTED:
      return connections(state, action.payload)
    case CONNECT_FAIL:
      return {
        ...state,
        connecting: false,
        error: action.payload
      }
    case CONNECT_SENDING:
      return {
        ...state,
        connecting: true,
        sending: true
      }
    case CONNECT_SENT:
      return acceptConnect(state, action.payload)
    case CS_FAIL:
      return {
        ...state,
        connecting: false,
        sending: false,
        error: action.payload
      }
    case DECLINE:
      return {
        ...state,
        connections: clearConnect(state, action.payload)
      }
    default:
      return state;
  }
}

export default rootReducer;