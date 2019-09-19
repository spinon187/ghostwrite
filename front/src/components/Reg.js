import React from 'react';

const Reg = props => {
  const regButton = props.regged !== true
    ? <button onClick={props.register}><h2>get a number</h2></button>
    : <h2>your user id is {props.uid}</h2>

  const reset = () => {
    localStorage.clear();
    window.location.reload();
  }
  return(
    <div className='reg'>
      {regButton}
      {/* <button onClick={reset}>reset</button>
      <button onClick={props.nukeAll}>nuke</button> */}
      <i className="material-icons" onClick={props.nukeAll}>block</i>

    </div>
  )
}

export default Reg;