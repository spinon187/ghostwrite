import React from 'react';

const WaitList = props => {

  const temp = props.waiting;
  const noZero = count => {
    return count > 0 ? count : null
  }

  const list = temp.map((waiter, index) => {
    return <div onClick={() => props.setActive(index, waiter[0])} key={index}><p>{waiter[0]}</p><span>{noZero(waiter[1])}</span></div>
  })

  return (
    <>
      {list}
    </>
  )
}

export default WaitList;