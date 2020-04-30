import React from 'react';
import NewMessage from './NewMessage';
import EditDisplayName from './EditDisplayName';
import styled from 'styled-components';

const Messages = props => {

  let toggled = props.editingName //toggles name editing field
  ? 'edit-name'
  : 'edit-name hidden'

  const formatDate = date => { //renders the date readable
    date = new Date(date);
    return `${date.getMonth() + 1}-${date.getDate()} ${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
  },
  
  history = props.partner //maps message text array into JSX
    ? props.history.map((msg, index) =>{
      return msg.msg.slice(0,5) === 'data:'
      ? <img key={index} alt={'img'} src={msg.msg} width='100%'/>
        : (msg.me) //if message has 'me' bool true, message anchors on right, else message anchors on left
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
    <MsgBox>
      {body}
    </MsgBox>
  )
}

const MsgBox = styled.div`
  height: 100%;
  #img-upload{
    display: none
  }
  .msg-history{
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #636363;
    .msg-header {
      width:100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .4rem 0;
      .id-wrapper {
        display: flex;
        width: 70%;
        justify-content: flex-start;
        padding-left: .5rem;
        margin: 0;
        .ellipsis-wrapper {
          white-space: nowrap;
          min-width: 0;
          text-overflow: ellipsis;
          overflow: hidden;

          h1 {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            min-width: 0;
            color: #DBDBDB;
            padding-left: .5rem;
          }
        }
      }
    }
    .msg-scroll{
      border-left: 2px solid #636363;
      display: flex;
      flex-direction: column-reverse;
      overflow-y: scroll;
      height: 80%;
      .msg {
        text-align: left;
        width: 90%;
        border: 1px solid #4C4C4C;
        background-color: #85C7F2;
        padding: .1rem .3rem;
        border-radius: 5px;
        margin-bottom: .2rem 0;
        text-overflow: ellipsis;
        .send-date {
          font-size: .8rem;
        }
        h3, p {
          padding-top: .5rem;
        }
        h3 {
          color: #4C4C4C;
          font-weight: bold;
        }
        p {
          color: #636363;
          font-size: 1.1rem;
        }
      }
      .sent{
        align-items: flex-end;
        align-self: flex-end;
        p {
          align-self: flex-start
        }
      }
      .received{
        align-items: flex-start;
        align-self: flex-start;
      }
    }
  }
  .button-bar {
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    button {
      width: 90%
    }
    .material-icons {
      width: 10%;
      color: #85C7F2;
      align-self: center;
    }
  }
`

export default Messages;