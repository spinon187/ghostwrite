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

  acceptReq = (e, partner) => {
    e.preventDefault();
    this.props.sendMsg({
      to: partner.from,
      from: this.props.uid,
      msg: 'connection accepted',
      key: this.props.pubKey,
      me: encr(partner.me, partner.sk),
      you: encr(partner.you, partner.sk),
      accept: true
    })
  }

  declineReq = (e, p) => {
    e.preventDefault();
    this.props.declineReq(p.from)
  }

  sendReq = e => {
    e.preventDefault();
    if(this.props.prohib[this.state.to]){
      //custom error popup
      this.props.openOverlay('dupe number')
    }
    else if(this.state.to.length === 10) this.props.sendMsg({
      to: this.state.to,
      from: this.props.uid,
      msg: 'requesting connection',
      request: true,
      key: this.props.pubKey}
    );
    this.setState({to: ''})
  }

  //pulls up informational overaly if help mode is active, runs functions if not
  reqFunc = () => {
    return this.props.helpMode
      ? this.props.openOverlay('contact help')
      : null
  }

  acceptFunc = (e, targ) => {
    return this.props.helpMode
      ? this.props.openOverlay('accept contact help')
      : this.acceptReq(e, targ)
  }

  declineFunc = (e, targ) => {
    return this.props.helpMode
      ? this.props.openOverlay('reject contact help')
      : this.declineReq(e, targ)
  }

  render(){

    const waitingConnections = 
      this.props.wc
      ? Object.keys(this.props.wc).map(request => {
        return (
          <div className='request' key={request}>
            <div className='id-wrapper'>
              <h2 onClick={this.reqFunc}>{request}</h2>
            </div>
            <div className='button-wrapper'>
              <i className="material-icons approve" onClick={e => this.acceptFunc(e, this.props.wc[request])}>check_circle_outline</i>
            </div>
            <div className='button-wrapper'>
              <i className="material-icons cancel" onClick={e => this.declineFunc(e, this.props.wc[request])}>block</i>
            </div>
          </div>
        )
      })
      : null

    const textToggle = this.props.wc && Object.keys(this.props.wc).length
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