import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, sendMsg, getMsg, targetNuke, nukeAll, clearWait, declineConnection, updateContact} from '../actions/index';
import Reg from './Reg';
import Messages from './Messages';
import WaitList from './WaitList';
import styled from 'styled-components';
import ConnectSelect from './ConnectSelect';
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

  declineReq = p => {
    this.props.declineConnection(p);
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
      ?<ConnectSelect
        uid={this.props.uid}
        pubKey={this.props.pubKey}
        wc={this.props.conReqs}
        sendMsg={this.sendMsg}
        privKey={this.props.privKey}
        declineReq={this.declineReq}
        prohib={this.props.prohib}
        openOverlay={this.openOverlay}
        helpMode={this.state.helpMode}
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
      />

    return (
      <MBox>
        <header><h1>ghostwrite</h1></header>
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
    prohib: state.prohib
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
    padding-right: 1rem;
    // padding-left: 2rem;
    &:hover{
      cursor: pointer;
    }
    align-self: center;
  }
  .approve {
    color: #00ff04;
  }
  .edit-icon {
    color: #85C7F2;
  }
  header {
    h1 {
      color: #85C7F2;
      font-size: 3.5rem;
      font-family: 'Righteous', cursive;
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

  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 28px;
      left: 28px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: -1px;
      left: -1px;
      width: 58px;
      height: 58px;
      opacity: 0;
    }
  }
  
  .loadscreen {
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    height: 100vh;
    width: 98vw;
    z-index: 1;
    background-color: #4C4C4C
    .loading-header{
      font-size: 1.6rem;
      padding: 2rem;
      padding-top: 40%;
    }
  }
  .m-body{
    min-height: 90vh;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    // border: 1px solid red;
    width: 100%;
    height: 100%;
    .reg {
      .user-number {
        display: flex;
        // justify-content: center;
        align-items: center;
        // text-align: center;
        width: 100%;
      }
      h1 {
        color: #D1D1D1;
        font-size: 1.6rem;
        // padding-left: 25%;
      }
      display: flex;
      justify-content: center;
      padding: 1rem;
      // padding-left: 19%;
    }
    .dummy {
      width: 40%;
    }
    .id-wrapper {
      width: 40%;
    }
    .button-wrapper {
      width: 20%;
    }
    .ellipsis-wrapper {
      // display: block;
      white-space: nowrap;
      min-width: 0;
      // max-width: 100px;
      text-overflow: ellipsis;
      overflow: hidden;
      // background-color: red;
      h1 {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .body-columns {
      display: flex;
      height: 90%;
      width: 100%;
      // border: 1px solid red;
      justify-content: space-between;

    }

    .contact-form {
      padding: 1rem 0;
    }

    .request {
      display: flex;
      padding-top: 1rem;
      // justify-content: center;
      align-items: center;
        .approve {
          color: lime;
        }
      .button-wrapper, .id-wrapper {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        // border: 1px solid red;
        h2 {
          padding-right: 1rem;
          // border: 1px solid red;

        }
      }
    }
    .msg-column {
      width: 65%;
      display: flex;
      flex-direction: column;
      form {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }

    .waitlist{
      display: flex;
      flex-direction: column;
      width: 35%;
      height: 100%;
      overflow-y: hidden;
      background-color: #636363;
      h2 {
        color: #DBDBDB;
        padding: .5rem;
      }
      .waitlist-item {
        background-color: #D1D1D1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // width: 100%;
        // border: 1px solid red;
        // max-width: 210px;
        padding: .2rem .4rem;
        border-bottom: 2px solid #636363;


        p {
          color: #4C4C4C;
          font-size: 1rem;
          white-space: nowrap;
          min-width: 0;
          // max-width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &:hover{
          cursor: pointer;
        }
        .new-count{
          background-color: red;
          color: white;
          // height: 1rem;
          width: 1rem;
          border-radius: 5px;
          font-size: .8rem;
        }
      }
      .active {
        background-color: #85C7F2;
        color: #DBDBDB;
      }
    }
    .msg-history{
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #636363;
      h1 {
        color: #DBDBDB;
        padding: .5rem;
      }
      .msg-header {
        display: flex;
        align-items: center;
        justify-content: center;
        // padding-left: 35%;
        .msg-id {
          display: flex;
          justify-content: flex-start;
          padding-left: 1rem;
        }
      }
      .msg-scroll{
        border-left: 2px solid #636363;
        display: flex;
        flex-direction: column-reverse;
        // align-items: center;
        overflow-y: scroll;
        height: 80%;
        .msg {
          // display: flex;
          // flex-direction: column;
          text-align: left;
          width: 80%;
          border: 1px solid #4C4C4C;
          background-color: #85C7F2;
          padding: .1rem .3rem;
          border-radius: 5px;
          margin: .2rem 0;
          text-overflow: ellipsis;
          // align-items: flex-start;
          // justify-content: flex-start;
          // white-space: nowrap;
          // overflow-x: hidden;
          .send-date {
            font-size: .8rem;
          }
          h3, p {
            padding-top: .5rem;
          }
          h3 {
            color: #4C4C4C;
            font-weight: bold;
          }
          p {
            color: #636363;
          }
        }
        .sent{
          align-items: flex-end;
          align-self: flex-end;
          p {align-self: flex-start}
        }
        .received{
          align-items: flex-start;
          align-self: flex-start;
        }
      }
    }
  }
`

export default connect(mapStateToProps, {register, sendMsg, getMsg, targetNuke, nukeAll, clearWait, declineConnection, updateContact})(Main);