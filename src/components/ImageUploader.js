import React from 'react';


const ImageUploader = props => {
  const handleChange = (e) => {
    e.preventDefault();
    let img = e.target.files[0],
    reader = new FileReader();
    if(img){
      reader.readAsDataURL(img);
      reader.onload = () => {
        props.loadImgPreview(reader.result)
      }
    }
  }

  const buttonSwap = props.isImgLoaded
    ? <>
        <span className="material-icons cancel" onClick={() => props.loadImgPreview(null)}>block</span>
      </>
    : <>
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

  return (
    <>
      {buttonSwap}
    </>
    
  )
}

export default ImageUploader