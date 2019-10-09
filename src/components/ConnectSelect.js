import React from 'react';
import {encr} from './Lockbox';

class ConnectSelect extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      to: ''
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }

  // sendMsg = e => {
  //   e.preventDefault()
  //   this.props.sendMsg({...this.state,from: this.props.uid, msg: this.props.pubKey, created: Date.now(), request: true});
  //   this.setState({to: ''})
  // }

  acceptReq = (e, pO) => { //pO = partnerObject
    e.preventDefault();
    this.props.acceptReq({
      to: pO.from,
      from: this.props.uid,
      key: this.props.pubKey,
      aliases: [encr(pO.aliases[0], this.props.pubKey), encr(pO.aliases[1], this.props.pubKey)],
      accept: true
    })
  }

  declineReq = (e, p) => {
    e.preventDefault();
    this.props.declineReq(p.from)
  }

  sendReq = e => {
    e.preventDefault();
    let msg = {to: this.state.to, from: this.props.uid, request: true, key: this.props.pubKey}
    console.log(msg)
    this.props.sendReq(msg)
  }

  render(){

    const waitingConnections = 
      Object.keys(this.props.wc)
      ? Object.keys(this.props.wc).map(request => {
        return (
          <div className='request' key={request}>
            <i className="material-icons approve" onClick={e => this.acceptReq(e, this.props.wc[request])}>check_circle_outline</i>
            <h2>{request}</h2>
            <i className="material-icons cancel" onClick={e => this.declineReq(e, this.props.wc[request])}>block</i>
          </div>
        )
      })
      : <div><h2>no connects</h2></div>

    return (
      <>
        <div><h2>Who would you like to connect with?</h2></div>
        <form>
          <textarea
            onChange={this.formTyping}
            placeholder="Enter your partner's 10-digit ID"
            value={this.state.to}
            name='to'
            type='text'
            rows='1'
            pattern='.{10,10}'
          ></textarea>
          <button type='button' onClick={e => this.sendReq(e)}>send request</button>
        </form>
        <div><h2>Contact requests:</h2></div>
        {waitingConnections}
      </>
    )
  }
}

export default ConnectSelect;