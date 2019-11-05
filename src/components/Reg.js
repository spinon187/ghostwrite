import React from 'react';

const Reg = props => {
  // const clear = () => {
  //   localStorage.clear();
  //   window.location.reload();
  // }

  // const reset = () => {
  //   return props.used
  //   ? props.nukeAll()
  //   : clear()
  // }

  // const reset = () => {
  //   props.nukeAll()
  // }

  //help mode functions
  const nukeFunc = () => {
    return props.helpMode
      ? props.openOverlay('full nuke help')
      : props.openOverlay('full nuke')
  },

  idFunc = () => {
    return props.helpMode
      ? props.openOverlay('id help')
      : null
  },

  regLoader = !props.uid
    ? <div className='loadscreen'>
        <p className='loading-header'>Finding you a new number...</p>
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    : <div className='user-number'>
        <div className='dummy'></div>
        <div className='id-wrapper'><h1 onClick={idFunc}>{props.uid}</h1></div>
        <div className='button-wrapper'><i className="material-icons" onClick={nukeFunc}>block</i></div>
        <div className='button-wrapper' onClick={props.toggleHelp}><i className="material-icons">help_outline</i></div>
      </div>

  return(
    <div className='reg'>
      {regLoader}
    </div>
  )
}

export default Reg;