import React from 'react';
import styled from 'styled-components';
import {overlaySwitch} from '../utils/OverlaySwitch';


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
  .ol-text {
    background-color: #85C7F2;
    z-index: 3;
    position: absolute;
    padding: 2rem;
    border: 2px solid #636363;
    border-radius: 5px;
    p {
      color: #636363;
    }
  }

`

const Overlay = props => {
  return props.switchTextType
  ? (
    <OLBox>
      <div className='transparency'></div>
      <div className='ol-text'>
        {overlaySwitch(props.switchTextType)}
        <div className='button-wrapper'>
            <i className="material-icons approve" onClick={() => props.openOverlay(null)}>check_circle_outline</i>
        </div>
      </div>
    </OLBox>
  )
  : null
}

export default Overlay;