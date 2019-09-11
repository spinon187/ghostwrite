import {
  REGGING,
  REGGED,
  REG_FAIL,
  SENDING,
  SENT,
  SEND_FAIL,
  RETRIEVING,
  RETRIEVED,
  RET_FAIL,
  CHECKING,
  CHECKED,
  CHECK_FAIL,
  FULL_NUKED,
  FULL_NUKING,
  TAR_NUKING,
  TAR_NUKED,
  NUKE_FAIL
} from '../actions/index';

const initialState = {
  error: null,
  regging: false,
  regged: null,
  sending: false,
  retrieving: false,
  waiting: {},
  msgs: {},
  nuking: false,
  uid: null
};

const addMsgs = (state, msgs, direction) => {
  let temp = state.msgs;
  if(direction === 'in'){
    msgs.forEach(msg => {
      temp[msg.from][msg.created] = msg
    })
  }
  else{
    msgs.forEach(msg => {
      temp[msg.to][msg.created] = msg 
    })
  }
  return temp;
}

const waitlist = (state, counts) => {
  let temp = state.waiting;
  counts.map((key, count) => temp[key] = temp[key] ? temp[key] + count : count);
  return temp;
}

const targetNuke = (state, target) => {
  let temp1 = state.msgs, temp2 = state.waiting;
  delete temp1[target];
  delete temp2[target];
  return {msgs: temp1, waiting: temp2}
} 

export const rootReducer = (state = initialState, action) => {
  switch(action.type) {
    case REGGING:
      return {
        ...state,
        regging: true
      }
    case REGGED:
      return {
        ...state,
        regging: false,
        regged: action.payload.reg,
        uid: action.payload.uid
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
      return {
        ...state,
        sending: false,
        msgs: addMsgs(state, action.payload, 'out')
      }
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
      return {
        ...state,
        retrieving: false,
        msgs: addMsgs(state, action.payload, 'in')
      }
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
    default:
      return state;
  }
}

export default rootReducer;