import React from 'react';
import NewMessage from './NewMessage';
import EditDisplayName from './EditDisplayName';

const Messages = props => {
  const history = props.active 
    ? props.history.map((msg, index) =>{
      return (msg.me)
      ? <div className='msg sent' key={index}>
          <p>{msg.msg}</p>
          <p className='send-date'>{msg.date}</p>
        </div>
      : <div className='msg received' key={index}>
          <p>{msg.msg}</p>
          <p className='send-date'>{msg.date}</p>
        </div>
    })
    : null

  let toggled = props.editingName
    ? 'edit-name'
    : 'edit-name hidden'

  return (
    <div className='msg-history'>
      <div className='msg-header'>
        <div className='id-wrapper msg-id'><h1>{props.dispID}</h1></div>
        <div className='button-wrapper'><i className="material-icons" onClick={e => props.toggle(e)}>edit</i></div>
        <div className='button-wrapper'><i className="material-icons" onClick={() => props.targetNuke(props.active)}>block</i></div>
      </div>
      <div className={toggled}><EditDisplayName partner={props.partner} update={props.update} toggle={props.toggle}/></div>
      <div className='msg-scroll'>{history}</div>
      <NewMessage encSelf={props.encSelf} partner={props.partner} sendMsg={props.sendMsg} sk={props.sk}/>
    </div>
  )
}

export default Messages;