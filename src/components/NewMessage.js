import React from 'react';
import {encr} from './Lockbox';

class NewMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      msg: '',
      buttonFade: 'faded'
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value, buttonFade: ''})
  }

  // componentDidMount(){
  //   this.setState({
  //     to: this.props.active
  //   })
  // }
  
  sendMsg = e => {
    if(this.state.to.length){
      e.preventDefault()
      this.props.sendMsg({to: this.props.partner, from: this.props.encSelf, msg: encr(this.state.msg, this.props.sk), created: Date.now()});
      this.setState({msg: ''})
    }
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
            autoComplete='off'
            required
          ></textarea>
          <button type='submit' className={this.state.buttonFade}>send message</button>
        </form>
      </>
    )
  }

}

export default NewMessage;