import React from 'react';
import NewMessage from './NewMessage';

const Messages = props => {
  const history = props.active 
    ? props.history.map((msg, index) =>{
      return (msg[0] === props.uid)
      ?
        <div className='sent' key={index}>
          <h3>From me</h3>
          <p>{msg[1]}</p>
          <p>{msg[2]}</p>
        </div>
      :
        <div className='received' key={index}>
        <h3>From {msg[0]}</h3>
        <p>{msg[1]}</p>
        <p>{msg[2]}</p>
      </div>
    })
    : <div>messages go here</div>

  return (
    <>
      {history}
      <NewMessage uid={props.uid} active={props.active} which={props.active} sendMsg={props.sendMsg}/>
    </>
  )
}

export default Messages;