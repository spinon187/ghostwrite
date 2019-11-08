import React from 'react';
import styled from 'styled-components';

const Reg = props => {

  //help mode conditional functions
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

  helpHighlight = props.helpMode
    ? 'active-help'
    : 'inactive-help'

  const regLoader = !props.uid
    //shows loading screen if registration function is running, user header if not
    ? <div className='loadscreen'>
        <p className='loading-header'>Finding you a new number...</p>
        <div className="lds-ripple"><div></div><div></div></div> {/* css ripple animation */}
      </div>
    : <div className='user-number'>
        <div className='dummy'></div>
        <div className='id-wrapper'><h1 onClick={idFunc}>{props.uid}</h1></div>
        <div className='button-wrapper'><i className="material-icons" onClick={nukeFunc}>block</i></div>
        <div className='button-wrapper' onClick={props.toggleHelp}><i className={`material-icons ${helpHighlight}`}>help_outline</i></div>
      </div>

  return(
    <RegBox>
      <div className='reg'>
        {regLoader}
      </div>
    </RegBox>
  )
}

const RegBox = styled.div`
  .reg {
    .user-number {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    h1 {
      color: #D1D1D1;
      font-size: 1.6rem;
    }
    display: flex;
    justify-content: center;
    padding: 1rem 0;
  }

  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 28px;
      left: 28px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: -1px;
      left: -1px;
      width: 58px;
      height: 58px;
      opacity: 0;
    }
  }

  .loadscreen {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 98vw;
    z-index: 1;
    background-color: #4C4C4C
    .loading-header{
      font-size: 1.6rem;
      padding: 2rem;
      padding-top: 40%;
    }
  }
`

export default Reg;