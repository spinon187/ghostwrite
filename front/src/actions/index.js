import axios from 'axios';
require('dotenv').config();
const baseURL = process.env.BE_URL || 'http://localhost:7777';

export const REGGING = 'REGGING', REGGED = 'REGGED', REG_FAIL = 'REG_FAIL', SENDING = 'SENDING', SENT = 'SENT', SEND_FAIL = 'SEND_FAIL', RETRIEVING = 'RETRIEVING', RETRIEVED = 'RETRIEVED', RET_FAIL = 'RET_FAIL', CHECKING = 'CHECKING', CHECKED = 'CHECKED', CHECK_FAIL = 'CHECK_FAIL', FULL_NUKED = 'FULL_NUKED', FULL_NUKING = 'FULL_NUKING', TAR_NUKING = 'TAR_NUKING', TAR_NUKED = 'TAR_NUKED', NUKE_FAIL = 'NUKE_FAIL', CLEAR = 'CLEAR';

export const register = uid => dispatch => {
      dispatch({type: REGGING});
      axios.post(`${baseURL}/api/uid`, uid)
        .then(res => dispatch({type: REGGED, payload: res.data}))
        .catch(err => dispatch({type: REG_FAIL, payload: err}))
    },

    check = uid => dispatch => {
      dispatch({type: CHECKING});
      axios.get(`${baseURL}/api/${uid}/check`)
        .then(res => dispatch({type: CHECKED, payload: res.data}))
        .catch(err => dispatch({type: CHECK_FAIL, payload: err}))
    },

    sendMsg = msg => dispatch => {
      dispatch({type: SENDING});
      axios.post(`${baseURL}/api/send`, msg)
        .then(res => dispatch({type: SENT, payload: msg}))
        .catch(err => dispatch({type: SEND_FAIL, payload: err}))
    },

    getMsg = (to) => dispatch => {
      dispatch({type: RETRIEVING});
      axios.get(`${baseURL}/api/${to}`)
        .then(res => dispatch({type: RETRIEVED, payload: res.data}))
        .catch(err => dispatch({type: RET_FAIL, payload: err}))
    },

    targetNuke = (to, from) => dispatch => {
      dispatch({type: TAR_NUKING});
      axios.delete(`${baseURL}/api/${to}/${from}`)
        .then(res => dispatch({type: TAR_NUKED, payload: res.data.targeted}))
        .catch(err => dispatch({type: NUKE_FAIL, payload: err}))
    },

    nukeAll = (uid, targs) => dispatch => {
      dispatch({type: FULL_NUKING});
      axios.delete(`${baseURL}/api/uid`, {uid: uid, targs: targs})
        .then(res => dispatch({type: FULL_NUKED, payload: res.data}))
        .catch(err => dispatch({type: NUKE_FAIL, payload: err}))
    },

    clearWait = partner => dispatch => {
      dispatch({type: CLEAR, payload: partner});
    }