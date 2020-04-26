import React from 'react';
import ImageUploader from './ImageUploader';

class NewMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      msg: '',
      buttonFade: 'faded' //send button only lights up when you've typed something
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value, buttonFade: ''})
  }
  
  sendMsg = e => {
    if(this.state.msg.length){
      e.preventDefault()
      //to and from should both be ZK aliases, not 10 digit IDs
      this.props.sendMsg({to: this.props.target, from: this.props.me, msg: this.state.msg, created: Date.now()});
      this.setState({msg: ''})
    }
  }

  render(){
    return(
      <>
        <form onSubmit={e => this.sendMsg(e)}>
          <textarea
            onChange={this.formTyping}
            placeholder='Enter new message'
            value={this.state.msg}
            name='msg'
            type='text'
            rows='4'
            autoComplete='off'
            required
          ></textarea>
          <button type='submit' className={this.state.buttonFade}>send message</button>
          <ImageUploader />
        </form>
      </>
    )
  }

}

export default NewMessage;