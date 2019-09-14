import React from 'react';

const Reg = props => {
  const regButton = props.regged !== true
    ? <button onClick={props.register}>get a number</button>
    : <h2>your user id is {props.uid}</h2>

  const reset = () => {
    localStorage.clear();
    window.location.reload();
  }
  return(
    <>
      {regButton}
      <button onClick={reset}>reset</button>
      <button onClick={props.nukeAll}>nuke</button>
    </>
  )
}

export default Reg;