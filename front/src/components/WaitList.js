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

  const list = temp.map((waiter, index) => {
    return <div className={highlight(waiter[0])} onClick={() => props.setActive(index, waiter[0])} key={index}><p>{waiter[0]}</p>{noZero(waiter[1])}</div>
  })

  return (
    <div className='waitlist'>
      <h2>Messages</h2>
      {list}
    </div>
  )
}

export default WaitList;