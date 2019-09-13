import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait} from '../actions/index';
import Reg from './Reg';
import Messages from './Messages';
import WaitList from './WaitList';
import NewMessage from './NewMessage';

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
    return this.props.uid ? this.props.check(this.props.uid) : null
  }

  buildWaitList = (targ=null) => {
    let temp = this.props.waiting, list = [];
    if(targ !== null) this.props.clearWait(targ);
    Object.keys(temp).forEach(key => {
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
        let dispDate = `${date.getDay()} ${date.getMonth()}-${date.getDate()} ${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
        disp.push([temp[order[i]].from, temp[order[i]].msg, dispDate]);
      }
      this.setState(() => {return {history: disp}})
    }
  };

  sendMsg = msg => {
    this.props.sendMsg(msg)
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
    return this.props.uid ? this.props.getMsg(this.props.uid) : null
  }

  nukeAll = () => {
    let targs = this.props.msgs.keys(), uid = this.props.uid;
    this.props.nukeAll(uid, targs);
    this.setState({
      uid: null,
      regged: null,
      active: 'sender',
      history: [],
      waiting: null,
      toSend: {}
    })
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

  targetNuke = (to, from) => {
    this.props.targetNuke(to, from);
    this.updateActive();
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
        history={this.state.history}
        sendMsg={this.sendMsg}
      />

    return (
      <div>
        <Reg 
          uid={this.state.uid} 
          regged={this.state.regged} 
          register={this.register}
        />
        <WaitList 
          waiting={this.state.waiting}
          setActive={this.updateActive}
        />
        {conditional}
      </div>
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
    waiting: state.waiting
  }
}

export default connect(mapStateToProps, {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait})(Main);