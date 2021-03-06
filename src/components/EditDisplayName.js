import React from 'react';

export default class EditDisplayName extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      newName: '',
      buttonFade: 'faded'
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value, buttonFade: ''})
  }

  update = e => {
    e.preventDefault();
    this.props.update(this.props.target, this.state.newName);
    this.props.toggle(e);
    this.setState({newName: '', buttonFade: 'faded'})
  }

  cancelUpdate = e => {
    e.preventDefault();
    this.setState({newName: '', buttonFade: 'faded'});
    this.props.toggle(e);
    // this.props.check();
  }

  render(){
    return(
      <>
        <form onChange={this.formTyping} onSubmit={e => this.update(e)}>
          <input 
            onChange={this.formTyping}
            placeholder="Enter a new name for this contact"
            value={this.state.newName}
            name='newName'
            type='text'
            required
          />
          <div className='edit-buttons'>
            <button type='submit' className={this.state.buttonFade}>accept</button>
            <button onClick={e => this.cancelUpdate(e)}>cancel</button>
          </div>
        </form>
      </>
    )
  }
}