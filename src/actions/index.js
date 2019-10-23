import axios from 'axios';
import {encr} from '../components/Lockbox';

const baseURL = 'https://specback.herokuapp.com';
// const baseURL = 'http://localhost:7777'


export const REGGING = 'REGGING', REGGED = 'REGGED', REG_FAIL = 'REG_FAIL', SENT = 'SENT', SEND_FAIL = 'SEND_FAIL', RECEIVED = 'RECEIVED', REC_FAIL = 'REC_FAIL', FULL_NUKED = 'FULL_NUKED', TAR_NUKED = 'TAR_NUKED', NUKE_FAIL = 'NUKE_FAIL', VIEW = 'VIEW', DECLINE = 'DECLINE', UPDATING_CONTACT = 'UPDATING_CONTACT';

const header = token => {
  return {headers: {Authorization: token}}
}

export const 
  register = uid => dispatch => {
    dispatch({type: REGGING});
    axios.post(`${baseURL}/api/uid`, uid)
      .then(res => dispatch({type: REGGED, payload: res.data}))
      .catch(err => dispatch({type: REG_FAIL, payload: err}))
  },

  declineConnection = partner => dispatch => {
    dispatch({type: DECLINE, payload: partner})
  },

  sendMsg = (pl, token, sk=null) => dispatch => {
    let msg = {...pl};
    if(sk) msg.msg = encr(pl.msg, sk);
    axios.post(`${baseURL}/api/send`, msg, header(token))
      .then(res => dispatch({type: SENT, payload: pl}))
      .catch(err => dispatch({type: SEND_FAIL, payload: err}))
  },

  getMsg = (to, token) => dispatch => {
    axios.post(`${baseURL}/api/msgs`, to, header(token))
      .then(res => dispatch({type: RECEIVED, payload: res.data}))
      .catch(err => dispatch({type: REC_FAIL, payload: err}))
  },

  targetNuke = (to, from, token) => dispatch => {
    axios.post(`${baseURL}/api/delete`, {to: to, from: from}, header(token))
      .then(res => dispatch({type: TAR_NUKED, payload: res.data.targeted}))
      .catch(err => dispatch({type: NUKE_FAIL, payload: err}))
  },

  nukeAll = (targs, token) => dispatch => {
    axios.post(`${baseURL}/api/nuke`, targs, header(token))
      .then(res => dispatch({type: FULL_NUKED, payload: res.data}))
      .catch(err => dispatch({type: NUKE_FAIL, payload: err}))
  },

  clearWait = target => dispatch => {
    dispatch({type: VIEW, payload: target});
  },

  updateContact = (target, dummyID) => dispatch => {
    dispatch({type: UPDATING_CONTACT, payload: {target: target, dummyID: dummyID}})
  }