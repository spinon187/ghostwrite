import {
  REGGING,REGGED,REG_FAIL,SENDING,SENT,SEND_FAIL,RETRIEVING,RETRIEVED,RET_FAIL,CHECKING,
CHECKED,CHECK_FAIL,FULL_NUKED,FULL_NUKING,TAR_NUKING,TAR_NUKED,NUKE_FAIL,CLEAR,SELF_NUKE,KEYING,KEYED,KEY_FAIL
} from '../actions/index';
import {keyPair, secretize, encr, decr} from '../components/Lockbox';

const initialState = {
  error: null,
  regging: false,
  regged: null,
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
};



const addMsgs = (state, msgs, direction) => {
  let ret = state, temp = state.msgs, toNuke = [], keyring = state.keyring, priv = state.privKey, waiting = state.waiting;
  if(direction === 'in'){
    msgs.forEach(msg => {
      if(msg.accept === true){
        let shared = secretize(msg.msg, priv), obj = encr(msg, shared), tag = obj.from, self = obj.to;
        keyring[tag] = [shared, msg.from, self];
        waiting = {...waiting, tag: 1}
      }
      else{
        let key = keyring[msg.from][0], decrypted = decr(msg, key);
        if(decrypted.nuke === true){
          toNuke.push(decrypted.from);
        }
        if(!temp[decrypted.from]){
          temp[decrypted.from] = {};
        }
        temp[decrypted.from][decrypted.created] = decrypted
      }
    })
  }
  else{
    let key = keyring[msgs.to][0], decrypted = decr(msgs, key);
    if(!temp[msgs.to]){
      temp[msgs.to] = {};
    }
    temp[msgs.to][decrypted.created] = decrypted
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
  let temp = state.waiting, keyring = state.keyring;
  if(Object.keys(counts).length > 0){
    Object.keys(counts).forEach(id =>{
      if(keyring[id]) id = keyring[1]; 
      temp[id] = temp[id] ? temp[id] + counts[id] : counts[id]
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
    default:
      return state;
  }
}

export default rootReducer;