import React from 'react';
import {encr} from '../utils/Lockbox';
import styled from 'styled-components';

class ContactsManager extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      to: '',
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value.replace(/\D/,'')})
  }

  acceptReq = (e, partner) => {
    e.preventDefault();
    this.props.sendMsg({
      to: partner.from,
      from: this.props.uid,
      msg: 'connection accepted', //this isn't necessary, it just looks nice
      key: this.props.pubKey,
      //sends two encrypted aliases to partner on acceptance that the server never decodes
      //any actual text messages will use these aliases for addressing
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
      //overlay popup preventing duplicate requests
      this.props.openOverlay('dupe number')
    }
    else if(this.state.to.length === 10) this.props.sendMsg({
      to: this.state.to,
      from: this.props.uid,
      msg: 'requesting connection', //again, not necessary, but looks nice
      request: true,
      key: this.props.pubKey //public key sent so recipient can generate a shared key right away
    });
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

  pendingFunc = () => {
    return this.props.helpMode
      ? this.props.openOverlay('pending help')
      : null
  }

  clearFunc = targ => {
    return this.props.helpMode
      ? this.props.openOverlay('pending clear help')
      : this.props.clearPendingEntry(targ)
  }

  emptyListFunc = () => {
    return this.props.helpMode
      ? this.props.openOverlay('no reqs help')
      : null
  }

  headerFunc = () => {
    return this.props.helpMode
      ? this.props.openOverlay('cm header help')
      : null
  }


  render(){

    const waitingConnections = this.props.wc
      ? Object.keys(this.props.wc).map(request => {
        return (
          <div className='request' key={request}>
            <div className='dummy'></div>
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
      : null,
      
    pendingConnections = this.props.pending
      ? this.props.pending.map(request => {
        return (
          <div className='request' key={request}>
            <div className='dummy'></div>
            <div className='id-wrapper'>
              <h2 onClick={this.pendingFunc}>{request}</h2>
            </div>
            <div className='button-wrapper'>
              <i className="material-icons cancel" onClick={() => this.clearFunc(request)}>block</i>
            </div>
          </div>
        )
      })
    : null,

    textToggle = this.props.wc && Object.keys(this.props.wc).length
    ? <h2>Contact requests:</h2>
    : <h2 onClick={this.emptyListFunc}>No new contact requests</h2>,

    pendingToggle = this.props.pending && this.props.pending.length
      ? <h2>Outgoing contact requests:</h2>
      : null,

    buttonClass = this.state.to.length && (this.state.to.length === 10)
      ? ''
      : 'faded'

    return (
      <CMBox>
        <div><h2 onClick={this.headerFunc}>Who would you like to connect with?</h2></div>
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
          <button type='button' className={buttonClass} onClick={e => this.sendReq(e)}>send request</button>
        </form>
        <div>{textToggle}</div>
        {waitingConnections}
        <div>{pendingToggle}</div>
        {pendingConnections}
      </CMBox>
    )
  }
}

const CMBox = styled.div`
  .contact-form {
    padding: 1rem 0;
    input {
      padding-left: .2rem;
    }
  }
  h2 {
    margin-top: 1rem;
  }
  .request {
    display: flex;
    width: 100%;
    padding-top: 1rem;
    align-items: center;
    .button-wrapper {
      display: flex;
      justify-content: flex-end;
      font-size: 1.4rem;
    }
    .id-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      h2 {
        margin-top: 0;
        margin-right: 2rem;
      }
    }
  }
`

export default ContactsManager;