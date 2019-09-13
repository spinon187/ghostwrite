import React from 'react';

class NewMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      to: '',
      from: this.props.uid,
      msg: ''
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }

  componentDidMount(){
    this.setState({
      to: this.props.which === 'sender' ? '' : this.props.active
    })
  }
  
  sendMsg = e => {
    e.preventDefault()
    this.props.sendMsg({...this.state, created: Date.now()});
    this.setState({msg: ''})
  }

  render(){
    let conditional = this.props.which === 'sender' ? <input type='text' name='to' value={this.state.to} placeholder='enter recipient' onChange={this.formTyping}/> : null;
    return(
      <>
        <form onSubmit={e => this.sendMsg(e)}>
          {conditional}
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