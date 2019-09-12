import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait} from '../actions/index';
import Reg from './Reg';
import Messages from './Messages';

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      uid: this.props.uid,
      regged: this.props.regged,
      waiting: [],
      active: null,
      history: []
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

  buildWaitList = () => {
    let temp = this.props.waiting, list = [];
    Object.keys(temp).forEach(key => list.push([key, this.props.waiting[key]])
    )
    console.log(list);
    this.setState(() => {return {waiting: list}})
  }

  sortMsgs = partner => {
    console.log(partner);
    if(this.props.msgs[partner]){    
      let temp = this.props.msgs[partner], disp = [];
      let order = Object.keys(temp).sort((a, b) => a-b);
      for(let i in order){
        disp.push([temp[order[i]].from, temp[order[i]].msg, temp[order[i]].created]);
      }
      this.setState(() => {return {history: disp}})
    }
  };

  sendMsg = msg => {
    this.props.sendMsg(msg)
    this.setState({
      ...this.state,
      history: [...this.history, [msg.from, msg.msg, msg.created]]
    })
  }

  getMsg = () => {
    this.props.getMsg(this.props.uid);
  }

  nukeAll = () => {
    let targs = this.props.msgs.keys(), uid = this.props.uid;
    this.props.nukeAll(uid, targs);
    this.setState({
      uid: null,
      regged: null,
      active: null,
      history: [],
      waiting: null
    })
  }

  bundle = () => {
    this.check();
    this.getMsg();
  }

  updateActive = (x=0) => {
    this.bundle();
    const delayBWL = () => this.buildWaitList();
    const delaySet = () => {
      let temp = this.state.waiting.length > 0 ? this.state.waiting[x][0] : null;
      this.setState(() => {
        return {active: temp}
      },
  )
    }
    const delaySort = () => this.sortMsgs(this.state.active);
    setTimeout(() => delayBWL(), 2000);
    setTimeout(() => delaySet(), 2200);
    setTimeout(() => delaySort(), 2300);
  }

  targetNuke = (to, from) => {
    this.props.targetNuke(to, from);
    this.updateActive();
  }

  componentDidMount(){
    this.updateActive();
  }

  

  render(){
    return (
      <div>
        <Reg 
          uid={this.state.uid} 
          regged={this.state.regged} 
          register={this.register}
        />
        <Messages
          uid={this.state.uid}
          active={this.state.active}
          history={this.state.history}
        />
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