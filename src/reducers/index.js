import {
  REGGING,REGGED,REG_FAIL,SENT,SEND_FAIL,RECEIVED,REC_FAIL,FULL_NUKED,TAR_NUKED,NUKE_FAIL,VIEW,DECLINE,UPDATING_CONTACT
} from '../actions/index';
import {keyPair} from '../components/Lockbox';
import * as utils from '../utils/ReducerUtils';

const initialState = {
  error: null,
  regging: false, //registration status
  regged: null, //^^^
  auth: null, //jwt received from server, used for connection request authentication specifically and other operations generally 
  msgs: {}, //files messages by partner
  keyring: {}, //files partners by ZK alias, contains shared key, partner's cosmetic ID, own ZK alias, and unread message count
  pubKey: null, //user's public DH key
  privKey: null, //user's private DH key
  uid: null, //10 digit ID assigned upon registration for used in connection requests
  conReqs: {}, //connection requests from other users awaiting acceptance/rejection
  crCount: 0, //number of connection requests awaiting resolution
  myIds: [] //store for 10 digit connection ID plus all ZK aliases for server queries
};

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
        pubKey: keys[1],
        myIds: [action.payload.uid]
      }
    case REG_FAIL:
      return {
        ...state,
        regging: false,
        regged: false,
        error: action.payload
      }
    case SENT:
      return utils.sendHandler(state, action.payload)
    case SEND_FAIL:
      return {
        ...state,
        error: action.payload
      }
    case RECEIVED:
      return utils.rcvHandler(state, action.payload)
    case REC_FAIL:
      return {
        ...state,
        recieving: false,
        error: action.payload
      }
    case FULL_NUKED:
      return initialState
    case TAR_NUKED:
      return utils.targetNuke(state, action.payload)
    case NUKE_FAIL:
      return {
        ...state,
        error: action.payload
      }
    case VIEW:
      return utils.clearWait(state, action.payload)
    case DECLINE:
      return utils.clearConnect(state, action.payload)
    case UPDATING_CONTACT:
      return utils.updateContact(state, action.payload.target, action.payload.dummyID)
    default:
      return state;
  }
}

export default rootReducer;