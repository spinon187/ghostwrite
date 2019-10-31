import React from 'react';

export const overlaySwitch = (input, func1=null, func2=null) => {
  switch(input){
    case 'test':
      return 'this is a test'
    case 'dupe number':
      return (
        <>
          <p>You've already entered that number.</p>
          <br />
          <br />
          <p>Please select a new one.</p>
          <br />
          <br />
          <i className="material-icons approve" onClick={func1}>check_circle_outline</i>
        </>
      )
    case 'nuke target':
      return (
        <>
          <p>Are you sure you want to delete this contact?</p>
          <br />
          <br />
          <div>
            <i className="material-icons approve" onClick={func1}>check_circle_outline</i>
            <i className="material-icons" onClick={func2}>block</i>
          </div>
        </>
      )
    
    default:
      return null
  }
}