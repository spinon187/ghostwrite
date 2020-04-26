import React from 'react';

export default class ImageUploader extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      file: null
    }
  }

  handleChange(e){
    let file = e.target.files[0],
    reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({file: reader.result})
    }
  }


  render(){

    const thumbnail = this.state.file
    ? <img alt='preview' src={this.state.file} width='100%'/>
    : null

    return (
      <>
        <input 
          type='file' 
          className='img-upload'
          name='file'
          accept='image/*'
          onChange={e => this.handleChange(e)}
        />
        <div>{thumbnail}</div>
      </>
    )
  }
}