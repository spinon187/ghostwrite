import React from 'react';
import ImageUploader from './ImageUploader';

class NewMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      msg: '',
      buttonFade: 'faded', //send button only lights up when you've typed something
      imgToSend: this.props.imgToSend
    }
  }

  formTyping = e => {
    e.preventDefault();
    if(!this.state.img) this.setState({[e.target.name]: e.target.value, buttonFade: ''})
  }

  loadImgPreview = img => {
    this.props.loadImgPreview(img)
    this.setState({
      buttonFade: '',
      imgToSend: img
    })
  }
  
  sendMsg = e => {
    if(this.state.msg.length || this.state.imgToSend){
      e.preventDefault()
      let content = this.state.imgToSend || this.state.msg;
      //to and from should both be ZK aliases, not 10 digit IDs
      this.props.sendMsg({to: this.props.target, from: this.props.me, msg: content, created: Date.now()});
      this.setState({msg: '', imgToSend: null})
    }
  }



  render(){

    let boxswap = !this.state.imgToSend
    ? <textarea
        onChange={this.formTyping}
        placeholder='Enter new message'
        value={this.state.msg}
        name='msg'
        type='text'
        rows='4'
        autoComplete='off'
        // required
      ></textarea>
    : <img alt='preview' src={this.state.imgToSend} height='48px'/>

    return(
      <>
        <form onSubmit={e => this.sendMsg(e)}>
          {boxswap}
          <button type='submit' className={this.state.buttonFade}>send message</button>
          <ImageUploader 
            loadImgPreview={this.loadImgPreview}
          />
        </form>
      </>
    )
  }

}

export default NewMessage;