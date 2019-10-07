import React from 'react';
// import {Badge, SideNav, SideNavItem} from 'react-materialize';


const WaitList = props => {

  const temp = props.waiting;
  const noZero = count => {
    return count > 0 ? <div className='new-count'>{count}</div> : <div></div>
  }

  const highlight = x => {
    return x === props.active ? 'waitlist-item active' : 'waitlist-item'
  }

  const list = 
    !temp
    ? null
    : temp.map((waiter, index) => {
    return <div className={highlight(waiter[0])} onClick={() => props.setActive(waiter[0])} key={index}><p>{waiter[1]}</p>{noZero(waiter[2])}</div>
  })

  const toggler =
    props.cscount
    ? <><p>New Contacts:</p>{noZero(props.cscount)}</>
    : <><p>Contact Someone</p></>

  return (
    <div className='waitlist'>
      <div className='waitlist-item' onClick={() => props.setActive(null)}>{toggler}</div>
      <h2>Messages</h2>
      {list}
    </div>
  )
}

export default WaitList;