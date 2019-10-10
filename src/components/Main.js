import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait, selfNuke, makeKey, getConnections, sendConnection, declineConnection} from '../actions/index';
import Reg from './Reg';
import Messages from './Messages';
import WaitList from './WaitList';
// import {Navbar} from 'react-materialize';
import styled from 'styled-components';
import ConnectSelect from './ConnectSelect';
// import {encr, decr} from './Lockbox';
import {testit} from './Lockbox';


//palette: #D1D1D1 #DBDBDB #85C7F2 #636363 #4C4C4C



class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      uid: this.props.uid,
      regged: this.props.regged,
      waiting: [],
      active: null,
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
    let arr = [];
    let noMut = this.props.keyring;
    if(noMut) Object.keys(noMut).forEach(id => arr.push(noMut[id][3]));
    if(arr)arr.forEach(id => this.props.check({to: id}, this.props.auth))
  }

  buildWaitList = (targ=null) => {
    let temp = this.props.waiting, list = [];
    if(targ) this.props.clearWait(targ);
    if(temp) Object.keys(temp).forEach(key => {
        list.push([key, this.props.keyring[key][1], temp[key]])
    })
    this.setState(() => {return {waiting: list}})
  }

  sortMsgs = partner => {
    if(this.props.keyring[partner]){    
      let temp = this.props.msgs[partner], disp = [];
      if(temp){
        let order = Object.keys(temp).sort((a, b) => a-b);
        for(let i in order){
          let date = new Date(order[i])
          let dispDate = `${date.getMonth() + 1}-${date.getDate()} ${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
          disp.unshift([this.props.keyring[partner][1], temp[order[i]], dispDate]);
        }
        this.setState(() => {return {history: disp}})}
    }
  };

  sendMsg = msg => {
    console.log(msg);
    this.props.sendMsg(msg, this.props.auth);
  }

  getMsg = () => {
    let arr = [], noMut = this.props.keyring;
    if(noMut) Object.keys(noMut).forEach(id => arr.push(noMut[id][2]));
    if(arr) arr.forEach(id => this.props.getMsg({to: id}, this.props.auth));
    console.log(arr)
  }

  getConnections = () => {
    this.props.getConnections({to: this.props.uid}, this.props.auth);
    // if(this.props.toKey){
    //   this.props.makeKey();
    // }
  }

  nukeAll = () => {
    let targs = Object.keys(this.props.keyring), uid = this.props.uid;
    // console.log(targs)
    this.props.nukeAll(uid, targs, this.props.auth);
    localStorage.clear();
    window.location.reload();
  }

  initBundle = (targ) => {
    if(this.props.uid){
      this.getConnections();
      this.check();
      this.getMsg();
      const delayBWL = () => this.buildWaitList(targ);
      setTimeout(() => delayBWL(), 1500);
    }
  }

  updateActive = (targ=null) => {
    this.initBundle(targ)
    const delaySet = () => {
      // let temp = this.state.waiting.length > 0 ? this.state.waiting[x] : null;
      this.setState(() => {
        return {active: targ}
      })
    }
    const delaySort = () => this.sortMsgs(this.state.active);
    setTimeout(() => delaySet(), 200);
    setTimeout(() => delaySort(), 1100);
  }

  targetNuke = target => {
    this.props.targetNuke(target, this.props.keyring[target][3], this.props.auth);
    this.setState({active: null}, () => this.initBundle());
  }

  selfNuke = target => {
    this.props.selfNuke(target);
    this.setState({active: null}, () => this.initBundle());
  }

  sendReq = to => {
    console.log(to);
    this.props.sendConnection(to, this.props.auth);
  }

  acceptReq = contents => {
    this.props.sendConnection(contents, this.props.auth);
    this.initBundle();
  }

  declineReq = p => {
    this.props.declineConnection(p);
    this.initBundle();
  }


  componentDidMount(){
    this.initBundle();
    setInterval(() => this.initBundle(), 10000);
    testit();
  }

  render(){

    let conditional = this.state.active === null
      ?<ConnectSelect
        uid={this.props.uid}
        pubKey={this.props.pubKey}
        wc={this.props.connections}
        acceptReq={this.acceptReq}
        declineReq={this.declineReq}
        sendReq={this.sendReq}
        privKey={this.props.privKey}
      />
      :<Messages
        uid={this.props.uid}
        partner={this.state.active}
        active={this.state.active}
        dispID={this.props.keyring[this.state.active][1]}
        encSelf={this.props.keyring[this.state.active][2]}
        history={this.state.history}
        sendMsg={this.sendMsg}
        targetNuke={this.targetNuke}
        sk={this.props.keyring[this.state.active][0]}
      />

    return (
      <MBox>
        <header><h1>GHOSTWRITE</h1></header>
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
              cscount={Object.keys(this.props.connections).length}
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
    privKey: state.privKey,
    auth: state.auth,
    connections: state.connections,
    toKey: state.toKey
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

    .request {
      display: flex;
      padding: 1rem;
      justify-content: space-around;
        .approve {
          color: lime;
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

export default connect(mapStateToProps, {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait, selfNuke, makeKey, getConnections, sendConnection, declineConnection})(Main);