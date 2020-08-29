import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chatwindow from './Chatwindow';
import Fab from '@material-ui/core/Fab';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  chat_window: {
    position: 'absolute',
    bottom: '80px',
    right: theme.spacing(5),
    width: "28%",
    visibility: 'hidden'
  },

  chat_window_visible: {
    position: 'absolute',
    bottom: '80px',
    right: theme.spacing(5),
    width: "28%"
  },

  fab: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(3),
  },
}));


const ChatLauncher = () => {
  const classes = useStyles();
  const [launcheropen, setLauncher] = React.useState(false)
  const [firstTime, setFirstTime] = React.useState(true);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [assignedAgentName, setAssignedAgentName] = React.useState("Chat with us!");
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [notifyme, setNotifyme] = React.useState(true);
  // const [avatarURL, setAvatarURL] = React.useState("");

  React.useEffect(() => {
    const notificationstate = JSON.parse(localStorage.getItem('notificationstate'));
    if(notificationstate != null){
      setNotifyme(notificationstate);
    }
    if(localStorage.getItem('browserID') == null){
      localStorage.setItem('browserID',Math.random());
    }
    if(localStorage.getItem('conversationToken') != null){
      handleFirstTime(); 
    }
  }, [notifyme]);

  const handleFirstTime = () => {
    setFirstTime(false);
  }

  const handleClick = () => {
    setLauncher(!launcheropen);
    if (launcheropen) setNotificationCount(0);
  }
  
  return (
    <div className={classes.root}>
      <div className={launcheropen ? classes.chat_window_visible : classes.chat_window}>
         <Chatwindow
          firstTime={firstTime}
          handleFirstTime={handleFirstTime}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          assignedAgentName={assignedAgentName}
          setAssignedAgentName={setAssignedAgentName}
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
          notifyme={notifyme}
          setNotifyme={setNotifyme}
          // avatarURL={avatarURL}
          // setAvatarURL={setAvatarURL}
          />
      </div>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleClick}>
        {!launcheropen && !notifyme && <ChatBubbleRoundedIcon />}
        {!launcheropen && notifyme && <Badge color="secondary" badgeContent={notificationCount}><ChatBubbleRoundedIcon /></Badge>}
        {launcheropen && <CloseRoundedIcon />}
      </Fab>
    </div>
  );
}

export default ChatLauncher;