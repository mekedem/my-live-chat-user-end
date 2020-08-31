import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Register from './Register';
import Chatlive from './Chatlive';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 450,
    height: 550,
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px"
  }
}));

const Chatwindow = (props) => {
  const classes = useStyles();
  const {firstTime, chatMessages, setChatMessages, assignedAgentName, setAssignedAgentName, notifyme, setNotifyme, handleEmittedMessage, handleStartConversation, offline, ioconnected} = props;

  return (
    !firstTime ? <Chatlive 
            chatMessages={chatMessages} 
            setChatMessages={setChatMessages}
            assignedAgentName={assignedAgentName}
            setAssignedAgentName={setAssignedAgentName}
            notifyme={notifyme}
            setNotifyme={setNotifyme}
            handleEmittedMessage={handleEmittedMessage}
            offline={offline}
            ioconnected={ioconnected}
            // avatarURL={props.avatarURL}
            // setAvatarURL={props.setAvatarURL}
            /> : <Card className={classes.root}>
      <CardContent>
        <Register handleStartConversation={handleStartConversation}/>
      </CardContent>
    </Card>
  );
}

export default Chatwindow;