import axios from 'axios';

const baseURL = 'https://specback.herokuapp.com';
// const baseURL = 'http://localhost:7777'


export const REGGING = 'REGGING', REGGED = 'REGGED', REG_FAIL = 'REG_FAIL', SENDING = 'SENDING', SENT = 'SENT', SEND_FAIL = 'SEND_FAIL', RETRIEVING = 'RETRIEVING', RETRIEVED = 'RETRIEVED', RET_FAIL = 'RET_FAIL', CHECKING = 'CHECKING', CHECKED = 'CHECKED', CHECK_FAIL = 'CHECK_FAIL', FULL_NUKED = 'FULL_NUKED', FULL_NUKING = 'FULL_NUKING', TAR_NUKING = 'TAR_NUKING', TAR_NUKED = 'TAR_NUKED', NUKE_FAIL = 'NUKE_FAIL', CLEAR = 'CLEAR', SELF_NUKE = 'SELF_NUKE', KEYED = 'KEYED', KEYING = 'KEYING', KEY_FAIL = 'KEY_FAIL', CONNECTING = 'CONNECTING', CONNECTED = 'CONNECTED', CONNECT_FAIL = 'CONNECT_FAIL', CONNECT_SENDING = 'CONNECT_SENDING', CONNECT_SENT = 'CONNECT_SENT', CS_FAIL = 'CS_FAIL', DECLINE = 'DECLINE', UPDATING_CONTACT = 'UPDATING_CONTACT';

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

  check = (uid, token) => dispatch => {
    dispatch({type: CHECKING});
    axios.post(`${baseURL}/api/check`, uid, header(token))
      .then(res => dispatch({type: CHECKED, payload: res.data}))
      .catch(err => dispatch({type: CHECK_FAIL, payload: err}))
  },

  getConnections = (uid, token) => dispatch => {
    dispatch({type: CONNECTING})
    axios.post(`${baseURL}/api/connections`, uid, header(token))
      .then(res => dispatch({type: CONNECTED, payload: res.data}))
      .catch(err => dispatch({type: CONNECT_FAIL, payload: err}))
  },

  sendConnection = (msg, token) => dispatch => {
    dispatch({type: CONNECT_SENDING})
    axios.post(`${baseURL}/api/reqs`, msg, header(token))
      .then(res => dispatch({type: CONNECT_SENT, payload: msg.to}))
      .catch(err => dispatch({type: CS_FAIL, payload: err}))
  },

  declineConnection = partner => dispatch => {
    dispatch({type: DECLINE, payload: partner})
  },

  sendMsg = (msg, token) => dispatch => {
    dispatch({type: SENDING});
    axios.post(`${baseURL}/api/send`, msg, header(token))
      .then(res => dispatch({type: SENT, payload: msg}))
      .catch(err => dispatch({type: SEND_FAIL, payload: err}))
  },

  getMsg = (to, token) => dispatch => {
    dispatch({type: RETRIEVING});
    axios.post(`${baseURL}/api/msgs`, to, header(token))
      .then(res => dispatch({type: RETRIEVED, payload: res.data}))
      .catch(err => dispatch({type: RET_FAIL, payload: err}))
  },

  targetNuke = (to, from, token) => dispatch => {
    dispatch({type: TAR_NUKING});
    axios.post(`${baseURL}/api/delete`, {to: to, from: from}, header(token))
      .then(res => dispatch({type: TAR_NUKED, payload: res.data.targeted}))
      .catch(err => dispatch({type: NUKE_FAIL, payload: err}))
  },

  nukeAll = (uid, targs, token) => dispatch => {
    dispatch({type: FULL_NUKING});
    axios.post(`${baseURL}/api/nuke`, {uid: uid, targs: targs}, header(token))
      .then(res => dispatch({type: FULL_NUKED, payload: res.data}))
      .catch(err => dispatch({type: NUKE_FAIL, payload: err}))
  },

  clearWait = partner => dispatch => {
    dispatch({type: CLEAR, payload: partner});
  },

  selfNuke = targ => dispatch => {
    dispatch({type: SELF_NUKE, payload: targ})
  },

  makeKey = () => dispatch => {
    dispatch({type: KEYING})
    // let arr2 = [];
    // arr.forEach(tk => {
    //   const toPush = [decr(tk.aliases[0],tk.key), tk.key, tk.from, decr(tk.aliases[1], tk.sk)]
    // })
  },

  updateContact = (partner, displayName) => dispatch => {
    dispatch({type: UPDATING_CONTACT, payload: {partner: partner, displayName: displayName}})
  }