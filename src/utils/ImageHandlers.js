export const resizeImg = (img) => { //needs original image in base64+width+height
  const cvs = document.createElement('canvas'), //creating canvas to redraw image smaller
  scaleFactor = 275/img.width, //max-width of new image divided by width
  newH = img.height*scaleFactor,
  imgElem = new Image();
  imgElem.onload = () => {
    imgElem.src = img; //new height
    cvs.width = 275;
    cvs.height = newH;
    cvs.getContext('2d').drawImage(imgElem, 0, 0, cvs.width, cvs.height);
    return cvs.toDataURL();
  }
}