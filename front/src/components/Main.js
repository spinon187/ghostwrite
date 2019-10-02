import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait, selfNuke, makeKey} from '../actions/index';
import Reg from './Reg';
import Messages from './Messages';
import WaitList from './WaitList';
import NewMessage from './NewMessage';
// import {Navbar} from 'react-materialize';
import styled from 'styled-components';
// import {encr, decr} from './Lockbox';


//palette: #D1D1D1 #DBDBDB #85C7F2 #636363 #4C4C4C



class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      uid: this.props.uid,
      regged: this.props.regged,
      waiting: [],
      active: 'sender',
      history: [],
    }
  }

  register = () => {
    const delay = () => {
      this.setState({
        ...this.state,
        uid: this.props.uid,
        regged: this.props.regged
      })
    }

    if(this.state.regged !== true){
      let id = Math.floor(Math.random() * 8999999999 + 1000000000).toString();
      this.props.register({uid: id});
      setTimeout(() => delay(), 2400)
      setTimeout(() => this.register(), 2500)
    }
  }

  check = () => {
    return this.props.uid ? this.props.check({to: this.props.uid}) : null
  }



  buildWaitList = (targ=null) => {
    let temp = this.props.waiting, list = [];
    if(targ) this.props.clearWait(targ);
    if(temp) Object.keys(temp).forEach(key => {
      return key === targ ? list.push([key, 0]) : list.push([key, this.props.waiting[key]])
    })
    this.setState(() => {return {waiting: list}})
  }

  sortMsgs = partner => {
    if(this.props.msgs[partner]){    
      let temp = this.props.msgs[partner], disp = [];
      let order = Object.keys(temp).sort((a, b) => a-b);
      for(let i in order){
        let date = new Date(temp[order[i]].created)
        let dispDate = `${date.getMonth() + 1}-${date.getDate()} ${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
        disp.unshift([temp[order[i]].from, temp[order[i]].msg, dispDate]);
      }
      this.setState(() => {return {history: disp}})
    }
  };

  sendMsg = msg => {
    this.props.sendMsg(msg);
    this.setState({
      ...this.state,
      active: msg.to
    }, () => {
      this.initBundle(msg.to);
      const delaySort = () => this.sortMsgs(this.state.active);
      setTimeout(() => delaySort(), 1900)
    })
  }

  getMsg = () => {
    let arr = [this.props.uid];
    let noMut = this.props.keyring;
    if(noMut) Object.keys(noMut).forEach(id => arr.push(id[3]))
    return this.props.uid ? this.props.getMsg(arr) : null
  }

  nukeAll = () => {
    let targs = Object.keys(this.props.msgs), uid = this.props.uid;
    console.log(targs)
    this.props.nukeAll(uid, targs);
    localStorage.clear();
    window.location.reload();
  }

  initBundle = (targ) => {
    this.check();
    this.getMsg();
    const delayBWL = () => this.buildWaitList(targ);
    setTimeout(() => delayBWL(), 1500);
  }

  updateActive = (x=0, targ=null) => {
    this.initBundle(targ)
    const delaySet = () => {
      let temp = this.state.waiting.length > 0 ? this.state.waiting[x][0] : null;
      this.setState(() => {
        if(temp) return {active: temp}
      })
    }
    const delaySort = () => this.sortMsgs(this.state.active);
    setTimeout(() => delaySet(), 1800);
    setTimeout(() => delaySort(), 1900);
  }

  targetNuke = target => {
    this.props.targetNuke(target, this.props.uid);
    this.setState({active: 'sender'}, () => this.initBundle());
  }

  selfNuke = target => {
    this.props.selfNuke(target);
    this.setState({active: 'sender'}, () => this.initBundle());
  }

  acceptReq = (pub, partner) => {
    this.props.makeKey(pub, this.props.privKey, partner, this.props.uid)
      .then(keyed => this.sendMsg({to: partner, from: this.props.uid, msg: this.props.pubKey, accept: true}))
  }

  componentDidMount(){
    this.initBundle();
  }

  render(){

    let conditional = this.state.active === 'sender'
      ?<NewMessage 
        uid={this.state.uid}
        active={this.state.active}
        which={this.state.active}
        sendMsg={this.sendMsg}
      />
      :<Messages
        uid={this.state.uid}
        active={this.state.active}
        dispID={this.props.keyring[this.state.active][1]}
        history={this.state.history}
        sendMsg={this.sendMsg}
        targetNuke={this.targetNuke}
        key={this.props.keyring[this.state.active][0]}
      />

    return (
      <MBox>
        <header><h1>SPECTRE</h1></header>
        <div className='m-body'>
          <Reg 
            uid={this.state.uid} 
            regged={this.state.regged} 
            register={this.register}
            nukeAll={this.nukeAll}
          />
          <div className='body-columns'>
            <WaitList 
              waiting={this.state.waiting}
              setActive={this.updateActive}
              active={this.state.active}
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
    sending: state.sending,
    retrieving: state.retrieving,
    msgs: state.msgs,
    uid: state.uid,
    waiting: state.waiting,
    keyring: state.keyring,
    pubKey: state.pubKey,
    privKey: state.privKey
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
    padding-left: 2rem;
    &:hover{
      cursor: pointer;
    }
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
  .m-body{
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    // border: 1px solid red;
    width: 100%;
    height: 100%;
    .reg {
      h2: {
        color: #D1D1D1
      }
      display: flex;
      justify-content: center;
      padding: 1rem;
      // padding-left: 19%;
    }
    .body-columns {
      display: flex;
      height: 90%;
      width: 100%;
      // border: 1px solid red;
      justify-content: space-between;

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
        padding: .2rem .4rem;
        border-bottom: 2px solid #636363;
        
        p {color: #4C4C4C; font-size: 1rem;}
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
        justify-content: space-between;
        // padding-left: 35%;
      }
      .msg-scroll{
        border-left: 2px solid #636363;
        display: flex;
        flex-direction: column-reverse;
        // align-items: center;
        overflow-y: scroll;
        height: 80%;
        .msg {
          display: flex;
          flex-direction: column;
          width: 80%;
          border: 1px solid #4C4C4C;
          background-color: #85C7F2;
          padding: .1rem .3rem;
          border-radius: 5px;
          margin: .2rem 0;
          text-overflow: ellipsis;
          align-items: flex-start;
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

export default connect(mapStateToProps, {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait, selfNuke, makeKey})(Main);