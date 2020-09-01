import React from 'react';
import useStyles from './chatwindowStyle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Register from '../registration/Register';
import Chatlive from '../live-chat/Chatlive';

const Chatwindow = (props) => {
  const classes = useStyles();
  const { firstTime, chatMessages, setChatMessages, assignedAgentName, setAssignedAgentName, notifyme, setNotifyme, handleEmittedMessage, handleStartConversation, offline, ioconnected } = props;

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
     /> : <Card className={classes.root}>
            <CardContent>
              <Register handleStartConversation={handleStartConversation} />
            </CardContent>
          </Card>
  );
}

export default Chatwindow;