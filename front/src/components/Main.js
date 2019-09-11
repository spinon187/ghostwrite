import React, {Component} from 'react';
import {connect} from 'react-redux';
import {register} from '../actions/index';
import Reg from './Reg';

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      uid: props.uid,
      regged: props.regged,
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
      setTimeout(() => delay(), 1500)
      setTimeout(() => this.register(), 3000)
    }
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
    uid: state.uid
  }
}

export default connect(mapStateToProps, {register})(Main);