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

  //help mode conditional functions
  toggleFunc = e => {
    return props.helpMode
      ? props.openOverlay('edit display name help')
      : props.toggle(e)
  },

  partnerFunc = () => {
    return props.helpMode
      ? props.openOverlay('partner id help')
      : null
  },

  nukeFunc = () => {
    return props.helpMode
      ? props.openOverlay('target nuke help')
      : props.openOverlay('nuke target')
  },

  body = props.partner
    ? <div className='msg-history'>
        <div className='msg-header'>
          <div className='id-wrapper msg-id'><div className='ellipsis-wrapper'><h1 onClick={partnerFunc}>{props.partner.dummyID}</h1></div></div>
          <div className='button-wrapper'><i className="material-icons edit-icon" onClick={e => toggleFunc(e)}>edit</i></div>
          <div className='button-wrapper'><i className="material-icons" onClick={nukeFunc}>block</i></div>
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