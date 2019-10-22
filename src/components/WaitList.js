import React from 'react';
// import {Badge, SideNav, SideNavItem} from 'react-materialize';


const WaitList = props => {
  const list = JSON.parse(JSON.stringify(props.list));

  const noZero = count => {
    return count > 0 ? <div className='new-count'>{count}</div> : <div></div>
  }

  const highlight = x => {
    return x === props.active ? 'waitlist-item active' : 'waitlist-item'
  }

  const display = 
    !list
    ? null
    : Object.keys(list).map((id, i) => {
    return <div className={highlight(id)} onClick={() => props.setActive(id)} key={i}><p>{list[id].dummyID}</p>{noZero(list[id].new)}</div>
  })

  // const list = 
  //   !temp
  //   ? null
  //   : temp.map((waiter, index) => {
  //   return <div className={highlight(waiter[0])} onClick={() => props.setActive(waiter[0])} key={index}><p>{waiter[1]}</p>{noZero(waiter[2])}</div>
  // })

  // const toggler =
  //   props.cscount
  //   ? <><p>New Contacts</p>{noZero(props.cscount)}</>
  //   : <><p>Contact Someone</p></>


  return (
    <div className='waitlist'>
      <div className='waitlist-item contact-bar' onClick={() => props.setActive(null)}><p>New Contacts</p>{noZero(props.crCount)}</div>
      <h2>Messages</h2>
      {display}
    </div>
  )
}

export default WaitList;