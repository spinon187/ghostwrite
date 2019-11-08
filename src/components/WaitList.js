import React from 'react';
import styled from 'styled-components';

const WaitList = props => {

  const noZero = count => { //prevents a case of zero unread messages from returning a big red zero
    return count > 0 ? <div className='new-count'>{count}</div> : <div></div>
  },

  highlight = x => { //highlights active number, null will highlight 'New Contacts'
    return x === props.active ? 'waitlist-item active' : 'waitlist-item'
  },

  //help mode conditional functions
  contactFunc = () => {
    return props.helpMode
      ? props.openOverlay('wl contact help')
      : null
  },

  newContactFunc = () => {
    return props.helpMode
      ? props.openOverlay('wl new help')
      : props.setActive(null)
  },

  display = //only attempts to render list if list is populated
    !props.list || props.list === {}
    ? null
    : Object.keys(props.list).map((id, i) => {
    return <div className={highlight(id)} onClick={() => props.setActive(id)} key={i}>
      <div className='ellipsis-wrapper'><p>{props.list[id].dummyID}</p></div>
      {noZero(props.list[id].new)}
    </div>
  })

  return (
    <WLBox>
      <div className='waitlist'>
        <div className={`waitlist-item contact-bar ${highlight(null)}`} onClick={newContactFunc}><p>New Contacts</p>{noZero(props.crCount)}</div>
        <h2 onClick={contactFunc}>Messages</h2>
        {display}
      </div>
    </WLBox>
  )
}

const WLBox = styled.div`
  width: 35%;
  .waitlist{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    background-color: #636363;
    h2 {
      color: #DBDBDB;
      padding: .5rem;
    }
    .waitlist-item {
      background-color: #D1D1D1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .2rem .4rem;
      border-bottom: 2px solid #636363;

      p {
        color: #4C4C4C;
        font-size: 1rem;
        white-space: nowrap;
        min-width: 0;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &:hover{
        cursor: pointer;
      }
      .new-count{
        background-color: red;
        color: white;
        // height: 1rem;
        width: 1rem;
        border-radius: 5px;
        font-size: .8rem;
      }
    }
    .active {
      background-color: #85C7F2;
      color: #DBDBDB;
    }
`

export default WaitList;