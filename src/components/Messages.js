import React from 'react';
import NewMessage from './NewMessage';


const Messages = props => {
  const history = props.active 
    ? props.history.map((msg, index) =>{
      return (msg[0] === props.uid)
      ? <div className='msg sent' key={index}>
          <h3>From me</h3>
          <p>{msg[1]}</p>
          <p className='send-date'>{msg[2]}</p>
        </div>
      : <div className='msg received' key={index}>
          <h3>From {msg[0]}</h3>
          <p>{msg[1]}</p>
          <p className='send-date'>{msg[2]}</p>
        </div>
    })
    : <div>messages go here</div>

  return (
    <div className='msg-history'>
      <div className='msg-header'>
        <h1>{props.dispID}</h1>
        <i className="material-icons" onClick={() => props.targetNuke(props.active)}>block</i>
      </div>
      <div className='msg-scroll'>{history}</div>
      <NewMessage uid={props.partner[2]} active={props.active} sendMsg={props.sendMsg} key={props.partner[0]}/>
    </div>
  )
}

export default Messages;