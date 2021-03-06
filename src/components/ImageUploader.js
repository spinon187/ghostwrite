import React from 'react';


const ImageUploader = props => {
  const handleChange = (e) => {
    e.preventDefault();
    let img = e.target.files[0],
    reader = new FileReader();
    if(img){ //need to make sure there's an image to be file-read or it crashes the whole page lol
      reader.readAsDataURL(img);
      reader.onload = () => {
        props.loadImgPreview(reader.result) //converts to base64 string
      }
    }
  }

  const buttonSwap = props.isImgLoaded //renders cancel button if image is loaded, upload button if one is not
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