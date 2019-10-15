import React from 'react';
import {encr} from './Lockbox';

class ConnectSelect extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      to: '',
      buttonFade: 'faded'
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value.replace(/\D/,''), buttonFade: ''}) //fix this later  
  }

  acceptReq = (e, pO) => { //pO = partnerObject
    e.preventDefault();
    this.props.acceptReq({
      to: pO.from,
      from: this.props.uid,
      key: this.props.pubKey,
      aliases: [encr(pO.aliases[0], pO.key), encr(pO.aliases[1], pO.key)],
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
    if(this.state.to.length) this.props.sendReq(msg);
    this.setState({to: ''})
  }


  render(){

    const waitingConnections = 
      Object.keys(this.props.wc)
      ? Object.keys(this.props.wc).map(request => {
        return (
          <div className='request' key={request}>
            <div className='id-wrapper'>
              <h2>{request}</h2>
            </div>
            <div className='button-wrapper'>
              <i className="material-icons approve" onClick={e => this.acceptReq(e, this.props.wc[request])}>check_circle_outline</i>
            </div>
            <div className='button-wrapper'>
              <i className="material-icons cancel" onClick={e => this.declineReq(e, this.props.wc[request])}>block</i>
            </div>
          </div>
        )
      })
      : <div><h2>no connects</h2></div>

    const textToggle = Object.keys(this.props.wc).length
    ? <h2>Contact requests:</h2>
    : <h2>No new contact requests</h2>

    return (
      <>
        <div><h2>Who would you like to connect with?</h2></div>
        <form className='contact-form'>
          <input
            onChange={this.formTyping}
            placeholder="Enter your partner's 10-digit ID"
            value={this.state.to}
            name='to'
            type='text'
            pattern='[0-9]{10}'
            minLength='10'
            maxLength='10'
            autoComplete='off'
            required
          />
          <button type='button' className={this.state.buttonFade} onClick={e => this.sendReq(e)}>send request</button>
        </form>
        <div>{textToggle}</div>
        {waitingConnections}
      </>
    )
  }
}

export default ConnectSelect;