import {
  REGGING,
  REGGED,
  REG_FAIL,
  SENDING,
  SENT,
  SEND_FAIL,
  RETRIEVING,
  RETRIEVED,
  RET_FAIL
} from '../actions/index';

const initialState = {
  error: null,
  regging: false,
  regged: false,
  sending: false,
  retrieving: false,
  msgs: {},
  uid: null
};

const addMsgs = (state, msgs) => {
  let temp = state.msgs;
  msgs.forEach(msg => {
      temp[msg.from] = {
        ...temp[msg.from],
        msg
      }
  });
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
        regged: true,
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
        sending: false
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
        msgs: addMsgs(state, action.payload)
      }
    case RET_FAIL:
      return {
        ...state,
        retrieving: false,
        error: action.payload
      }
    default:
      return state;
  }
}