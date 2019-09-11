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
  CHECK_FAIL
} from '../actions/index';

const initialState = {
  error: null,
  regging: false,
  regged: null,
  sending: false,
  retrieving: false,
  waiting: {},
  msgs: {},
  uid: null
};

const addMsgs = (state, msgs, direction) => {
  let temp = state.msgs;
  if(direction === 'in'){
    msgs.forEach(msg => {
      temp[msg.from] = {
        ...temp[msg.from],
        msg
      }
    })
  }
  else{
    msgs.forEach(msg => {
      temp[msg.to] = {
        ...temp[msg.to],
        msg
      }
    })
  }
  return temp;
}

const waitlist = (state, counts) => {
  let temp = state.waiting;
  counts.map((key, count) => temp[key] = temp[key] ? temp[key] + count : count);
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
    default:
      return state;
  }
}

export default rootReducer;