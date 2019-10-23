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

  const reset = () => {
    props.nukeAll()
  }

  const regLoader = !props.uid
    ? <div className='loadscreen'>
        <p className='loading-header'>Finding you a new number...</p>
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    : <div className='user-number'>
        <div className='dummy'></div>
        <div className='id-wrapper'><h1>{props.uid}</h1></div>
        <div className='button-wrapper'><i className="material-icons" onClick={reset}>block</i></div>
      </div>

  return(
    <div className='reg'>
      {regLoader}
    </div>
  )
}

export default Reg;