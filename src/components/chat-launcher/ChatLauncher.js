import React from 'react';
import Chatwindow from '../chat-window/Chatwindow';
import Fab from '@material-ui/core/Fab';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Badge from '@material-ui/core/Badge';
import io from "socket.io-client";
import {ENDPOINT} from '../../constants/Urls';
import {AGENTLEFT, AGENTASSIGNED, OFFLINE, TOKEN, MESSAGE, STARTCONVERSATION, CONNECT, ERROR} from '../../constants/Events.js';
import useStyles from './launcherStyle';

let socket;
let visitorQuery = { usertype: 'visitor', agency: 'telegram' };
if(!localStorage.getItem('browserID')){
  localStorage.setItem('browserID',Math.random());
}

const ChatLauncher = () => {
  const classes = useStyles();
  const [launcheropen, setLauncher] = React.useState(false)
  const [firstTime, setFirstTime] = React.useState(true);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [assignedAgentName, setAssignedAgentName] = React.useState("Chat with us!");
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [notifyme, setNotifyme] = React.useState(true);
  const [offline, setOffline] = React.useState(true);
  const [ioconnected, setioconnected] = React.useState(false);
  // const [avatarURL, setAvatarURL] = React.useState("");

  React.useEffect(() => {
    const notificationstate = JSON.parse(localStorage.getItem('notificationstate'));
    if(notificationstate != null) setNotifyme(notificationstate);
  }, [notifyme]);


  React.useEffect(() => {
    const token = localStorage.getItem('conversationToken');
    const browserID = localStorage.getItem('browserID').toString();
    
    if(!token){
      socket = io(ENDPOINT, { query: { ...visitorQuery, token:"", browserID }});
    }
    else{
      socket = io(ENDPOINT, { query: { ...visitorQuery, token, browserID }});
      setFirstTime(false);
    }
  }, [ENDPOINT]);


  React.useEffect(() => {
    
    socket.on(AGENTASSIGNED, ({name, avatarURL}) => {
      setAssignedAgentName(name);
      setOffline(false);
    //  setAvatarURL(avatarURL);
    });
    
    socket.on(MESSAGE, (msg) => {
      if(msg.sender){
        if(msg.sender.agent){
          const msga = { text: msg.text, sender: msg.sender, incomming:true};
          setChatMessages(chatMessages => [ ...chatMessages, {msg:msga}]);
          setNotificationCount(notificationCount => notificationCount + 1);
        }
        else if(msg.sender.visitor){
          const msgv = { text: msg.text, sender: msg.sender, incomming:false};
          setChatMessages(chatMessages => [ ...chatMessages, {msg:msgv}]);
        }
      }
        // console.log(conversationID);
        // console.log(createdAt.time);        
    });

    socket.on(OFFLINE, () => {
      setOffline(true);
    });

    socket.on(AGENTLEFT, () => {
      setOffline(true);
      setAssignedAgentName("");
        // setAvatarURL("")
    });

    socket.on(TOKEN, ({ token }) => {
      localStorage.setItem('conversationToken', token);
      setFirstTime(false);
    });

    socket.on(CONNECT, () => {
      setioconnected(true);
    });

    socket.on(ERROR, (err) => {
      console.log(err);
    });

  }, []);

  
  const handleClick = () => {
    setLauncher(!launcheropen);
    if (launcheropen) setNotificationCount(0);
  }

  const handleStartConversation = (email) => {
    setFirstTime(false);
    socket.emit(STARTCONVERSATION,{email}, (error) => {
      if(error) setioconnected(false);
    });
  }

  const handleEmittedMessage = (msg) => {
    socket.emit(MESSAGE, msg);
  }
  
  return (
    <div className={classes.root}>
      <div className={launcheropen ? classes.chat_window_visible : classes.chat_window}>
         <Chatwindow
            firstTime={firstTime}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            assignedAgentName={assignedAgentName}
            setAssignedAgentName={setAssignedAgentName}
            notifyme={notifyme}
            setNotifyme={setNotifyme}
            handleEmittedMessage={handleEmittedMessage}
            handleStartConversation={handleStartConversation}
            offline={offline}
            ioconnected={ioconnected}
            // avatarURL={avatarURL}
            // setAvatarURL={setAvatarURL}
          />
      </div>
      <Fab aria-label="add" className={classes.fab} onClick={handleClick}>
        {!launcheropen && !notifyme && <ChatBubbleRoundedIcon />}
        {!launcheropen && notifyme && <Badge color="secondary" badgeContent={notificationCount}><ChatBubbleRoundedIcon /></Badge>}
        {launcheropen && <CloseRoundedIcon />}
      </Fab>
    </div>
  );
}

export default ChatLauncher;