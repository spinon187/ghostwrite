import React from 'react';
import ImageUploader from './ImageUploader';
import {resizeImg} from '../utils/ImageHandlers';

class NewMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      msg: '',
      imgToSend: null
    }
  }

  formTyping = e => {
    e.preventDefault();
    if(!this.state.img) this.setState({[e.target.name]: e.target.value})
  }

  loadImgPreview = async img => {
    if(img){
      await resizeImg(img).then(
        resized => {
          this.setState({
            imgToSend: resized
          })
        }
      )
    } else {
      this.setState({
        imgToSend: null
      })
    }

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

  componentWillReceiveProps(next){
    if(next.target !== this.props.target){
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
    : <img alt='preview' src={this.state.imgToSend}/>,

    buttonClass = this.state.msg || this.state.imgToSend
    ? ''
    : 'faded'

    return(
      <div className='new-msg'>
        <form>
          {boxswap}
          <div className='button-bar'>
            <button className={buttonClass} onClick={e => this.sendMsg(e)}>send message</button>
            <ImageUploader 
              loadImgPreview={this.loadImgPreview}
              isImgLoaded={this.state.imgToSend ? true : false}
            />
          </div>
        </form>
      </div>
    )
  }

}

export default NewMessage;