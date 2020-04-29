import React from 'react';
import {resizeImg} from '../utils/ImageHandlers';

const ImageUploader = props => {
  const handleChange = (e) => {
    e.preventDefault();
    let img = e.target.files[0],
    reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
      const res = reader.result,
      cvs = document.createElement('canvas'), //creating canvas to redraw image smaller
      scaleFactor = 275/img.width, //max-width of new image divided by width
      newH = img.height*scaleFactor,
      imgElem = new Image();
      // imgElem.onload = () => {
        console.log(res)
        imgElem.src = res; //new height
        cvs.width = 275;
        cvs.height = newH;
        console.log(cvs)
        setTimeout(() => cvs.getContext('2d').drawImage(imgElem, 0, 0, cvs.width, cvs.height), 1000)
        // let x = cvs.canvas.toDataURL();
        let x;
        const dumb = v => v = cvs.toDataURL();
        setTimeout(() => dumb(x), 1500)
        setTimeout(() => console.log(x), 2000)
        setTimeout(() => props.loadImgPreview(x), 3000)
      // }
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