import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait, selfNuke} from '../actions/index';
import Reg from './Reg';
import Messages from './Messages';
import WaitList from './WaitList';
import NewMessage from './NewMessage';
import {Navbar} from 'react-materialize';


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
    return this.props.uid ? this.props.getMsg({to: this.props.uid}) : null
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
        targetNuke={this.targetNuke}
      />

    return (
      <>
        <Navbar centerLogo alignLinks='left'>SPECTRE</Navbar>
        <div>
          <Reg 
            uid={this.state.uid} 
            regged={this.state.regged} 
            register={this.register}
            nukeAll={this.nukeAll}
          />
          <WaitList 
            waiting={this.state.waiting}
            setActive={this.updateActive}
          />
          {conditional}
        </div>
      </>
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

export default connect(mapStateToProps, {register, check, sendMsg, getMsg, targetNuke, nukeAll, clearWait, selfNuke})(Main);