import React from 'react';

export const overlaySwitch = (input, func1=null, func2=null) => {
  switch(input){
    case 'test':
      return 'this is a test'
    case 'dupe number':
      return (
        <>
          <p>You've already entered that number.</p>
          <br /><br />
          <p>Please select a new one.</p>
          <br /><br />
          <i className="material-icons approve" onClick={func1}>check_circle_outline</i>
        </>
      )
    case 'nuke target':
      return (
        <>
          <p>Are you sure you want to delete this contact?</p>
          <br /><br />
          <div>
            <i className="material-icons approve" onClick={func1}>check_circle_outline</i>
            <i className="material-icons" onClick={func2}>block</i>
          </div>
        </>
      )

    //help messages
    case 'full nuke help':
      return (
        <>
          <p>Assigns you a new number and deletes your conversations from your previous contacts' devices.</p>
          <br /><br />
          <p>WARNING: Cannot be undone! If you want to continue a conversation with someone, make sure you've got their number recorded somewhere outside of Ghostwrite!</p>
        </>
      )
    case 'target nuke help':
      return (
        <>
          <p>Deletes this contact from your device and deletes you from their device.</p>
          <br /><br />
          <p>WARNING: Cannot be undone!</p>
        </>
      )
    
    
    default:
      return null
  }
}