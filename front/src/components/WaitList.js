import React from 'react';
import {Badge, SideNav, SideNavItem} from 'react-materialize';

const WaitList = props => {

  const temp = props.waiting;
  const noZero = count => {
    return count > 0 ? <Badge className="red" newIcon>{count}</Badge> : null
  }

  const list = temp.map((waiter, index) => {
    return <SideNavItem onClick={() => props.setActive(index, waiter[0])} key={index}><ul>{waiter[0]}{noZero(waiter[1])}</ul></SideNavItem>
  })

  return (
    <><SideNav fixed={true}>
      {list}
      </SideNav>
    </>
  )
}

export default WaitList;