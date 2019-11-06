import React from 'react';
import styled from 'styled-components';
import {overlaySwitch} from '../utils/OverlaySwitch';

const Overlay = props => {

  const func = 
    props.switchTextType === 'nuke target'
      ? props.targetNuke
    : props.switchTextType === 'full nuke'
      ? props.nukeAll
    : null

  const buttons = f =>
    f
      ? (
        <>
          <div className='button-wrapper'>
            <i className="material-icons approve" onClick={f}>check_circle_outline</i>
          </div>
          <div className='button-wrapper'>
            <i className="material-icons cancel" onClick={() => props.openOverlay(null)}>block</i>
          </div>
        </>
      ) 
      : <div className='button-wrapper'>
          <i className="material-icons approve" onClick={() => props.openOverlay(null)}>check_circle_outline</i>
        </div>

  return props.switchTextType
  ? (
    <OLBox>
      <div className='transparency'></div>
      <div className='ol-box'>
        <div className='ol-text'>{overlaySwitch(props.switchTextType)}</div>
        <br /><br />
        <div className='ol-button-bank'>
          {buttons(func)}
        </div>
      </div>
    </OLBox>
  )
  : null
}

const OLBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: absolute;
  .transparency {
    z-index: 2;
    width: 100%;
    height: 100%;
    opacity: .7;
    background-color: #636363
  }
  .ol-box {
    background-color: #85C7F2;
    z-index: 3;
    position: absolute;
    padding: 2rem;
    border: 2px solid #636363;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .ol-text {
      max-width: 400px;
      text-align: left;
      p {
        color: #636363;
      }
    }
    .ol-button-bank {
      display: flex;
      // width: 100%;
      justify-content: space-around;
      width: 80%;
    }
  }

`

export default Overlay;