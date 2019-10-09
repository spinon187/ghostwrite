import React from 'react';
import {encr} from './Lockbox';

class NewMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      to: this.props.active,
      from: this.props.uid,
      msg: '',
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }

  componentDidMount(){
    this.setState({
      to: this.props.active
    })
  }
  
  sendMsg = e => {
    e.preventDefault()
    this.props.sendMsg(encr({...this.state, created: Date.now()}, this.props.key));
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