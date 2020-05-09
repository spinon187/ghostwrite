export const resizeImg = (base64) => { //needs original image in base64+width+height
  return new Promise((resolve) => {
    const cvs = document.createElement('canvas'); //creating canvas to redraw image smaller
    let img = new Image();
    img.src = base64;
    img.onload = () => {
      let scaleFactor = 400/img.width, //max-width of new image divided by width
      newH = img.height*scaleFactor;
      cvs.height = newH;
      cvs.width = 400;
      cvs.getContext('2d').drawImage(img, 0, 0, 400, newH);
      resolve(cvs.toDataURL('image/jpeg'));
    }
  })
}