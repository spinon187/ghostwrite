import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, sendMsg, getMsg, targetNuke, nukeAll, clearWait, declineConnection, updateContact, clearPendingEntry} from '../actions/index';
import Reg from './Reg';
import Messages from './Messages';
import WaitList from './WaitList';
import styled from 'styled-components';
import ContactsManager from './ContactsManager';
import Overlay from './Overlay';


//palette: #D1D1D1 #DBDBDB #85C7F2 #636363 #4C4C4C


class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      uid: this.props.uid,
      waiting: [],
      active: null,
      history: [],
      editingName: false,
      overlayText: null,
      helpMode: false
    }
  }

  register = () => {
    if(this.props.regged !== true){
      let id = Math.floor(Math.random() * 8999999999 + 1000000000).toString();
      this.props.register({uid: id});
      setTimeout(() => this.register(), 2500)
    } else {
      this.checkPulse();
    }
  }

  sortMsgs = (partner=null) => {
    if(partner && partner === this.state.active && this.props.msgs[partner]){
      let tempArr = [...this.props.msgs[partner]];
      tempArr.sort((a, b) => b.created - a.created);
      this.setState({history: tempArr});
    } else {
      this.setState({history: []});
    }
  }

  sendMsg = msg => {
    this.clearWait();
    if(msg.accept || msg.request){
      this.props.sendMsg(msg, this.props.auth)
    } else {
      this.props.sendMsg(msg, this.props.auth, this.props.keyring[msg.to].sk)
    };
    setTimeout(() => {this.sortMsgs(this.state.active)}, 250);
  }

  getMsg = () => {
    this.props.getMsg({to: [...this.props.myIds]}, this.props.auth);
    if(this.state.active) this.sortMsgs(this.state.active)
  }

  nukeAll = () => {
    let targs = Object.entries({...this.props.keyring})
      .map(to => ({to: to[0], from: to[1].me}))
    targs.push({to: null, from: this.props.uid})
    this.props.nukeAll(targs, this.props.auth);
    // setTimeout(() => localStorage.clear(), 100);
    // setTimeout(() => window.location.reload(true), 2100);
    this.openOverlay(null);
    localStorage.clear();
    window.location.reload(true)
  }

  check = () => {
    if(this.props.uid) this.getMsg();
    if(!this.props.keyring[this.state.active]){
      this.setState({active: null});
    }
  }

  checkPulse = () => {
    if(!document.hidden) this.check();
    setTimeout(() => {
      this.checkPulse()
    }, 1000);
  }

  clearWait = () => {
    if(this.state.active) this.props.clearWait(this.state.active)
  }

  updateActive = (targ=null) => {
    this.check();
    setTimeout(() => {
      this.setState(() => {
        return {active: targ}
      }, () => this.clearWait())
    }, 200);
    setTimeout(() => {
      this.sortMsgs(this.state.active)
    }, 210);
  }

  targetNuke = () => {
    this.props.targetNuke(this.state.active, this.props.keyring[this.state.active].me, this.props.auth);
    setTimeout(() => {this.setState({active: null})}, 200);
  }

  editFormToggle = e => {
    e.preventDefault();
    this.setState({editingName: !this.state.editingName})
  }

  toggleHelp = () => {
    this.setState({helpMode: !this.state.helpMode})
  }

  openOverlay = (type) => {
    this.setState({overlayText: type})
  }

  componentDidMount(){
    return !this.props.uid
    ? this.register()
    : this.checkPulse();
  }

  render(){

    let conditional = this.state.active === null
      ?<ContactsManager
        uid={this.props.uid}
        pubKey={this.props.pubKey}
        wc={this.props.conReqs}
        sendMsg={this.sendMsg}
        privKey={this.props.privKey}
        declineReq={this.props.declineConnection}
        prohib={this.props.prohib}
        openOverlay={this.openOverlay}
        helpMode={this.state.helpMode}
        clearPendingEntry={this.props.clearPendingEntry}
        pending={this.props.pending}
      />
      :<Messages
        uid={this.props.uid}
        partner={this.props.keyring[this.state.active]}
        active={this.state.active}
        history={this.state.history}
        sendMsg={this.sendMsg}
        targetNuke={this.targetNuke}
        update={this.props.updateContact}
        editingName={this.state.editingName}
        toggle={this.editFormToggle}
        openOverlay={this.openOverlay}
        helpMode={this.state.helpMode}
      />,
    
    headerSwap = this.state.helpMode
      ? <div className='help-mode-engaged'><p>You've activated Help Mode! Click anything for an explanation of what it does.</p></div>
      : <h1>ghostwrite</h1>

    return (
      <MBox>
        <header>{headerSwap}</header>
        <Overlay 
          switchTextType={this.state.overlayText}
          openOverlay={this.openOverlay}
          nukeAll={this.nukeAll}
          targetNuke={this.targetNuke}
        />
        <div className='m-body'>
          <Reg 
            uid={this.props.uid}
            regging={this.props.regging}
            regged={this.props.regged} 
            register={this.register}
            nukeAll={this.nukeAll}
            openOverlay={this.openOverlay}
            used={this.props.keyring ? true : false}
            helpMode={this.state.helpMode}
            toggleHelp={this.toggleHelp}
          />
          <div className='body-columns'>
            <WaitList 
              list={this.props.keyring}
              setActive={this.updateActive}
              active={this.state.active}
              crCount={this.props.crCount}
              clearWait={this.clearWait}
              helpMode={this.state.helpMode}
              openOverlay={this.openOverlay}
            />
          <div className='msg-column'>
            {conditional}
          </div>
          </div>
        </div>
      </MBox>
    )
  }
}

const mapStateToProps = state => {
  return {
    error: state.error,
    regging: state.regging,
    regged: state.regged,
    msgs: state.msgs,
    uid: state.uid,
    keyring: state.keyring,
    pubKey: state.pubKey,
    privKey: state.privKey,
    auth: state.auth,
    conReqs: state.conReqs,
    myIds: state.myIds,
    crCount: state.crCount,
    prohib: state.prohib,
    pending: state.pending
  }
}

const MBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  align-items: center;
  .material-icons {
    color: red;
    &:hover{
      cursor: pointer;
    }
    align-self: center;
  }
  .approve {
    color: #00ff04;
  }
  .active-help {
    color: yellow;
  }
  .edit-icon, .inactive-help {
    color: #85C7F2;
  }
  header {
    h1 {
      color: #85C7F2;
      font-size: 3.5rem;
      font-family: 'Righteous', cursive;
    }
    .help-mode-engaged {
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  p, h1, h2, h3, h4, ul {
    color: #DBDBDB;
    font-size: 1.2rem;
  }
  button {
    background-color: #85C7F2;
    border: none;
    font-family: 'Righteous', cursive;
    color: #636363;
    font-size: 1rem;
  }
  .faded {
    opacity: 0.6;
  }
  .hidden {
    display: none
  }
  .edit-buttons {
    button {
      width: 50%;
    }
  }
  .m-body{
    min-height: 90vh;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .dummy {
      width: 30%;
    }
    .id-wrapper {
      width: 40%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 1.5rem;
    }
    .button-wrapper {
      width: 15%;
      display: flex;
      justify-content: center;
    }
    .ellipsis-wrapper {
      white-space: nowrap;
      min-width: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      h1 {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        min-width: 0;
      }
    }
    .body-columns {
      display: flex;
      height: 100%;
      width: 100%;
    }
    .msg-column {
      width: 65%;
      display: flex;
      height: 100%;
      flex-direction: column;
      form {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }   
  }
`

export default connect(mapStateToProps, {register, sendMsg, getMsg, targetNuke, nukeAll, clearWait, declineConnection, updateContact, clearPendingEntry})(Main);