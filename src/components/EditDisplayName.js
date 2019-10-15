import React from 'react';

export default class EditDisplayName extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      newName: ''
    }
  }

  formTyping = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }

  update = e => {
    e.preventDefault();
    this.props.update(this.props.partner, this.state.newName)
    this.props.toggle(e)
    this.props.bwl()
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
          />
        </form>
      </>
    )
  }
}