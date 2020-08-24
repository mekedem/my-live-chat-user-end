import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chatwindow from './Chatwindow';
import Fab from '@material-ui/core/Fab';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  chat_window: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(5),
    width: "28%",
    visibility: 'hidden'
  },

  chat_window_visible: {
    position: 'absolute',
    top: theme.spacing(1),
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
  const [assignedAgentName, setAssignedAgentName] = React.useState("");
  // const [avatarURL, setAvatarURL] = React.useState("");

  const handleFirstTime = () => {
    setFirstTime(false);
  }

  const handleClick = () => {
    setLauncher(!launcheropen);
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
          // avatarURL={avatarURL}
          // setAvatarURL={setAvatarURL}
          />
      </div>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleClick}>
        {!launcheropen && <ChatBubbleRoundedIcon />}
        {launcheropen && <CloseRoundedIcon />}
      </Fab>
    </div>
  );
}

export default ChatLauncher;