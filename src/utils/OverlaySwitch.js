import React from 'react';

export const overlaySwitch = input => {
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
        </>
      )
    default:
      return null
  }
}