import React from 'react';
import {encr} from './Lockbox';

class NewMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      msg: '',
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }

  // componentDidMount(){
  //   this.setState({
  //     to: this.props.active
  //   })
  // }
  
  sendMsg = e => {
    e.preventDefault()
    this.props.sendMsg({to: this.props.partner, from: this.props.encSelf, msg: encr(this.state.msg, this.props.sk), created: Date.now()});
    this.setState({msg: ''})
  }

  render(){
    return(
      <>
        <form onSubmit={e => this.sendMsg(e)}>
          <textarea
            onChange={this.formTyping}
            placeholder='enter new message'
            value={this.state.msg}
            name='msg'
            type='text'
            rows='4'
          ></textarea>
          <button type='submit'>send message</button>
        </form>
      </>
    )
  }

}

export default NewMessage;