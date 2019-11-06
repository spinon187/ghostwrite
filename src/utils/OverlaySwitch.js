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
          <p>This Assigns you a new number and deletes your conversations from your previous contacts' devices.</p>
          <br /><br />
          <p>WARNING: Cannot be undone! If you want to continue a conversation with someone, make sure you've got their number recorded somewhere outside of Ghostwrite!</p>
        </>
      )
    case 'target nuke help':
      return (
        <>
          <p>This deletes this contact from your device and deletes you from their device.</p>
          <br /><br />
          <p>WARNING: Cannot be undone!</p>
        </>
      )
    case 'id help':
      return (
        <>
          <p>This is your current Ghostwrite ID number.</p>
          <br /><br />
          <p>Share it with other people so they can connect with you!</p>
        </>
      )
    case 'contact help':
      return (
        <>
          <p>This is a request from someone who wants to connect with you.</p>
          <br /><br />
          <p>Make sure you know who they are before accepting!</p>
        </>
      )
    case 'accept contact help':
      return (
        <>
          <p>This button will add the user to your contact list.</p>
        </>
      )
    case 'reject contact help':
      return (
        <>
          <p>This button will decline the offer to connect.</p>
          <br /><br />
          <p>The sender won't be notified that you've done this.</p>
        </>
      )
    case 'edit display name help':
      return (
        <>
          <p>This allows you to update the name for this contact so you don't have to remember who's who based on numbers alone.</p>
          <br /><br />
          <p>Your contacts won't be able to see this.</p>
        </>
      )
    case 'partner id help':
      return (
        <>
          <p>This is who you're talking to right now!</p>
          <br /><br />
          <p>You can edit their name with the button to the right.</p>
        </>
      )
    case 'wl contact help':
      return (
        <>
          <p>This is a list of your contacts!</p>
        </>
      )
    case 'wl new help':
      return (
        <>
          <p>This will return you to the contact management screen.</p>
        </>
      )
    case 'pending help':
      return (
        <>
          <p>This is a list of the numbers you've sent requests to.</p>
        </>
      )
    case 'pending clear help':
      return (
        <>
          <p>This button clears this number from your pending contact request list.</p>
          <br /><br />
          <p>NOTE: This does not withdraw the request! Invitations you've sent can still be accepted.</p>
        </>
      )
    default:
      return null
  }
}