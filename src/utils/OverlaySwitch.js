import React from 'react';

export const overlaySwitch = input => {
  switch(input){
    case 'test':
      return <p>this is a test</p>
    case 'dupe number':
      return (
        <>
          <p>You've already entered that number.</p>
          <br /><br />
          <p>Please select a new one.</p>
        </>
      )
    case 'nuke target':
      return (
        <>
          <p>Are you sure you want to delete this contact?</p>
        </>
      )
    case 'full nuke':
      return (
        <>
          <p>Are you sure you want to reset Ghostwrite?</p>
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