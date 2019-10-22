import React from 'react';
// import {Badge, SideNav, SideNavItem} from 'react-materialize';


const WaitList = props => {

  const noZero = count => {
    return count > 0 ? <div className='new-count'>{count}</div> : <div></div>
  },

  highlight = x => {
    return x === props.active ? 'waitlist-item active' : 'waitlist-item'
  },

  display = 
    !props.list
    ? null
    : Object.keys(props.list).map((id, i) => {
    return <div className={highlight(id)} onClick={() => props.setActive(id)} key={i}><p>{props.list[id].dummyID}</p>{noZero(props.list[id].new)}</div>
  })

  return (
    <div className='waitlist'>
      <div className='waitlist-item contact-bar' onClick={() => props.setActive(null)}><p>New Contacts</p>{noZero(props.crCount)}</div>
      <h2>Messages</h2>
      {display}
    </div>
  )
}

export default WaitList;