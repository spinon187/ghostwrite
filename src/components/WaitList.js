import React from 'react';
// import {Badge, SideNav, SideNavItem} from 'react-materialize';


const WaitList = props => {

  const noZero = count => {
    return count > 0 ? <div className='new-count'>{count}</div> : <div></div>
  },

  highlight = x => {
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

  display = 
    !props.list || props.list === {}
    ? null
    : Object.keys(props.list).map((id, i) => {
    return <div className={highlight(id)} onClick={() => props.setActive(id)} key={i}>
      <div className='ellipsis-wrapper'><p>{props.list[id].dummyID}</p></div>
      {noZero(props.list[id].new)}
    </div>
  })

  return (
    <div className='waitlist'>
      <div className={`waitlist-item contact-bar ${highlight(null)}`} onClick={newContactFunc}><p>New Contacts</p>{noZero(props.crCount)}</div>
      <h2 onClick={contactFunc}>Messages</h2>
      {display}
    </div>
  )
}

export default WaitList;