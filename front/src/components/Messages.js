import React from 'react';

const Messages = props => {
  const history = props.active 
    ? props.history.map(msg =>{
      return (msg[0] === props.uid)
      ?
        <div className='sent'>
          <h3>From me</h3>
          <p>{msg[1]}</p>
          <p>{msg[2]}</p>
        </div>
      :
        <div className='received'>
        <h3>From {msg[0]}</h3>
        <p>{msg[1]}</p>
        <p>{msg[2]}</p>
      </div>
    })
    : <div>messages go here</div>

  return (
    <>
      {history}
    </>
  )
}

export default Messages;