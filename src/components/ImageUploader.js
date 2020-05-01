import React from 'react';


const ImageUploader = props => {
  const handleChange = (e) => {
    e.preventDefault();
    let img = e.target.files[0],
    reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
      props.loadImgPreview(reader.result)
    }
  }

  return (
    <>
      <label htmlFor='img-upload'>
        <span className="material-icons">add_photo_alternate</span>
      </label>
      <input 
        type='file' 
        id='img-upload'
        name='file'
        accept='image/*'
        onChange={e => handleChange(e)}
      />
    </>
  )
}

export default ImageUploader