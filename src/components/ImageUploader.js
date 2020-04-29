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
      <input 
        type='file' 
        className='img-upload'
        name='file'
        accept='image/*'
        onChange={e => handleChange(e)}
      />
    </>
  )
}

export default ImageUploader