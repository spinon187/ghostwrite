import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, sendMsg, getMsg, targetNuke, nukeAll, clearWait, declineConnection, updateContact, clearPendingEntry, clearConvo} from '../actions/index';
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
      helpMode: false,
      activeImg: null,
      imgToSend: null
    }
  }

  register = () => {
    if(!this.props.regged){ //auto registration function
      let id = Math.floor(Math.random() * 8999999999 + 1000000000).toString(); //random 10 digit id
      this.props.register({uid: id});
      //if server doesn't okay it because it happened to supply an already registered ID or some other reason, it will try to register again after a few seconds. Otherwise it starts the server check loop
      setTimeout(() => this.register(), 2500) 
    } else {
      this.checkPulse();
    }
  }

  //messages are added to their respective storage arrays in an only semi-sorted order, and it's possible for message ordering to get mixed up in the event of highly active conversation or internet problems. On-demand sort function irons this behavior out
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
    //resets unread messages for the active partner to zero, since it can be assumed if you're sending a message, you've seen any new ones
    this.clearWait();
    //contact requests and acceptances don't require a shared secret key as a parameter, only the server authentication token, but normal messages need both
    (msg.accept || msg.request)
      ? this.props.sendMsg(msg, this.props.auth)
      : this.props.sendMsg(msg, this.props.auth, this.props.keyring[msg.to].sk)
    setTimeout(() => {this.sortMsgs(this.state.active)}, 250);
  }

  getMsg = () => {
    //server is expecting an array of IDs to check for so this function needs the 10 digit plus any aliases the user's established with successful contacts
    //these IDs are also contained in the store's keyring objects but it's easier for this function to track them separately
    this.props.getMsg({to: [...this.props.myIds]}, this.props.auth);
    if(this.state.active) this.sortMsgs(this.state.active)
  }

  nukeAll = () => {
    //adds all partner aliases and own aliases to array in order to clear any outstanding ones remaining on the server at the time of user deletion
    let targs = Object.entries({...this.props.keyring})
      .map(to => ({to: to[0], from: to[1].me}))
    //also adds the 10 digit ID to clear any connection requests for or by the user
    targs.push({to: null, from: this.props.uid})
    this.props.nukeAll(targs, this.props.auth);
    this.openOverlay(null); //closes confirmation box
    localStorage.clear();
    window.location.reload(true)
  }

  check = () => {
     //checks the server for incoming messages
    if(this.props.uid) this.getMsg();
    //if partner is removed either by incoming or outgoing nuke request, resets the active partner to null and returns user to the contacts manager screen
    if(!this.props.keyring[this.state.active]){
      this.setState({active: null});
    }
  }

  checkPulse = () => {
    if(!document.hidden) this.check(); //only checks server if app is active tab
    // console.log(new Blob(Object.values(localStorage)).size)
    // console.log(navigator.storage.estimate())
    setTimeout(() => {
      this.checkPulse()
    }, 1000); //recurs every second unless the above condition is false
  }

  clearWait = () => { //sets unread messages for active partner to zero
    if(this.state.active) this.props.clearWait(this.state.active)
  }

  updateActive = (targ=null) => {
    this.check();
    //uses small setTimeouts to prevent behavior in which the state updates were lagging behind the message sorting, leading to mismatched message histories
    setTimeout(() => {
      this.setState(() => {
        return {active: targ}
      }, () => this.clearWait())
    }, 200);
    setTimeout(() => {
      this.sortMsgs(this.state.active)
    }, 210);
  }

  targetNuke = () => { //deletes contact and sends message to contact with nuke=true
    this.props.targetNuke(this.state.active, this.props.keyring[this.state.active].me, this.props.auth);
    this.openOverlay(null); //closes confirmation box
    setTimeout(() => {this.setState({active: null})}, 200);
  }

  clearConvo = () => {
    this.props.clearConvo(this.state.active, this.props.keyring[this.state.active].me, this.props.auth);
    this.openOverlay(null);
    this.clearWait();
  }

  editFormToggle = e => { //toggles edit contact name form on messaging screen
    e.preventDefault();
    this.setState({editingName: !this.state.editingName})
  }

  toggleHelp = () => { //activates help mode, see OverlaySwitch.js util
    this.setState({helpMode: !this.state.helpMode})
  }

  openOverlay = type => {
    //sets key in state equal to one of the strings in the OverlaySwitch.js switch
    //opens overlay with any value, null closes it
    this.setState({overlayText: type})
  }

  componentDidMount(){
    return !this.props.uid
    ? this.register()
    : this.checkPulse();
  }

  loadImgPreview = img => {
    this.setState({imgToSend: img})
  }

  render(){

    let conditional = !this.state.active
      //fills in contacts manager or messaging screen depending on active partner
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
        clearConvo={this.clearConvo}
        update={this.props.updateContact}
        editingName={this.state.editingName}
        toggle={this.editFormToggle}
        openOverlay={this.openOverlay}
        helpMode={this.state.helpMode}
        activeImg={this.state.activeImg}
        imgToSend={this.state.imgToSend}
        loadImgPreview={this.loadImgPreview}
      />,
    
    headerSwap = this.state.helpMode
      //logo if help mode off, help mode help if help mode on
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
          clearConvo={this.clearConvo}
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

export default connect(mapStateToProps, {register, sendMsg, getMsg, targetNuke, nukeAll, clearWait, declineConnection, updateContact, clearPendingEntry, clearConvo})(Main);