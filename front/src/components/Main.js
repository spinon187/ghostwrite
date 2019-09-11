import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, check, sendMsg, getMsg, targetNuke, nukeAll} from '../actions/index';
import Reg from './Reg';

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      uid: null,
      regged: null,
      waiting: null,
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
    this.props.check(this.props.uid)
  }

  sortMsgs = partner => {
    let temp = this.props.msgs[partner], disp = [];
    let order = temp.keys().sort((a, b) => a-b);
    for(let i in order){
      disp.push([temp[i].from, temp[i].msg, temp[i].created]);
    }
    this.setState({
      ...this.state,
      history: disp
    })
  };

  sendMsg = msg => {
    this.props.sendMsg(msg)
    this.setState({
      ...this.state,
      history: [...this.history, [msg.from, msg.msg, msg.created]]
    })
  }

  getMsg = from => {
    this.props.getMsg(this.props.uid, from);
    this.sortMsgs(from);
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

  updateActive = (x=0) => {
    this.check();
    this.setState({
      ...this.state,
      waiting: this.props.waiting,
      active: this.props.waiting ? this.props.waiting[x] : null,
    })
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
        <Reg uid={this.state.uid} regged={this.state.regged} register={this.register}/>
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

export default connect(mapStateToProps, {register, check, sendMsg, getMsg, targetNuke, nukeAll})(Main);