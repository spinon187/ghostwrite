import React from 'react';
import NewMessage from './NewMessage';
import EditDisplayName from './EditDisplayName';

const Messages = props => {

  let toggled = props.editingName
  ? 'edit-name'
  : 'edit-name hidden'

  const formatDate = date => {
    date = new Date(date);
    return `${date.getMonth() + 1}-${date.getDate()} ${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
  },
  
  history = props.partner 
    ? props.history.map((msg, index) =>{
      return (msg.me)
      ? <div className='msg sent' key={index}>
          <p>{msg.msg}</p>
          <p className='send-date'>{formatDate(msg.created)}</p>
        </div>
      : <div className='msg received' key={index}>
          <p>{msg.msg}</p>
          <p className='send-date'>{formatDate(msg.created)}</p>
        </div>
    })
    : null,



  body = props.partner
    ? <div className='msg-history'>
        <div className='msg-header'>
          <div className='id-wrapper msg-id'><h1>{props.partner.dummyID}</h1></div>
          <div className='button-wrapper'><i className="material-icons edit-icon" onClick={e => props.toggle(e)}>edit</i></div>
          <div className='button-wrapper'><i className="material-icons" onClick={() => props.targetNuke(props.active)}>block</i></div>
        </div>
        <div className={toggled}>
          <EditDisplayName
            target={props.active}
            update={props.update}
            toggle={props.toggle}
            dummyID={props.partner.dummyID}
          />
        </div>
        <div className='msg-scroll'>
          {history}
        </div>
        <NewMessage
          target={props.active}
          me={props.partner.me}
          sendMsg={props.sendMsg}
        />
      </div>
    : null


  return (
    <>{body}</>
  )
}

export default Messages;