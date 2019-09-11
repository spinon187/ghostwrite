import axios from 'axios';
require('dotenv').config();
const baseURL = process.env.BE_URL || 'http://localhost:7777';

export const REGGING = 'REGGING';
export const REGGED = 'REGGED';
export const REG_FAIL = 'REG_FAIL';
export const SENDING = 'SENDING';
export const SENT = 'SENT';
export const SEND_FAIL = 'SEND_FAIL';
export const RETRIEVING = 'RETRIEVING';
export const RETRIEVED = 'RETRIEVED';
export const RET_FAIL = 'RET_FAIL';
export const CHECKING = 'CHECKING';
export const CHECKED = 'CHECKED';
export const CHECK_FAIL = 'CHECK_FAIL';

export const register = uid => dispatch => {
  dispatch({type: REGGING});
  axios.post(`${baseURL}/api/uid`, uid)
    .then(res => dispatch({type: REGGED, payload: res.data}))
    .catch(err => dispatch({type: REG_FAIL, payload: err}))
}

export const check = uid => dispatch => {
  dispatch({type: CHECKING});
  axios.get(`${baseURL}/api/${uid}`)
    .then(res => dispatch({type: CHECKED, payload: res.data}))
    .catch(err => dispatch({type: CHECK_FAIL, payload: err}))
}

export const sendMsg = msg => dispatch => {
  dispatch({type: SENDING});
  axios.post(`${baseURL}/send`, msg)
    .then(res => dispatch({type: SENT, payload: msg}))
    .catch(err => dispatch({type: SEND_FAIL, payload: err}))
}

export const getMsg = (to, from) => dispatch => {
  dispatch({type: RETRIEVING});
  axios.get(`${baseURL}/${to}/${from}`)
    .then(res => dispatch({type: RETRIEVED, payload: res.data}))
    .catch(err => dispatch({type: RET_FAIL, payload: err}))
}