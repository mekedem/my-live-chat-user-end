import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { CardActions } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ListItemIcon } from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Scrollbars } from 'react-custom-scrollbars';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EmojiPicker from 'emoji-picker-react';
import './custom_EmojiPicker.css';
import Register from './Register';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 450,
    height: 550,
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px"
  },
  chatheaders: {
    backgroundColor: "#425B76",
    color: "#ffffff"
  },
  chatbody: {
    flex: 1
  },
  chatmessage: {
    position: "relative",
    fontSize: "16px",
    backgroundColor: "#EAF0F6",
    padding: "10px",
    color: "#33475b",
    borderRadius: "10px",
    width: "fit-content",
    marginBottom: "30px"
  },

  chatreceiver: {
    position: "relative",
    fontSize: "16px",
    padding: "10px",
    color: "#ffffff",
    borderRadius: "10px",
    width: "fit-content",
    marginBottom: "30px",
    marginLeft: "auto",
    backgroundColor: "#33475b"
  },

  chatfooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "62px",
  },

  chatfooterform: {
    flex: 1,
    display: "flex"
  },

  chatinput: {
    flex: 1,
    padding: "10px",
    border: "none"
  },
  chatsend: {
    display: "none"
  },
  emojiicon: {
    padding: "15px"
  },
  emojipicker: {
    position: 'absolute',
    bottom: theme.spacing(7),
    right: theme.spacing(2.2)
  }
}));

const Chatwindow = () => {
  const classes = useStyles();
  const [input, setInput] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pickerVisible, setPickerVisible] = React.useState(false);


  const sendMessage = (e) => {
    e.preventDefault();
    // console.log(input);
    setInput("");
    setPickerVisible(false);
  }

  const handleEmojiVisibility = () => {
    setPickerVisible(!pickerVisible);
  }

  const handleEmojiClick = (code, emojiObject) => {
    let sym = emojiObject.unified.split('-');
    let codesArray = [];
    sym.forEach(el => codesArray.push('0x' + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
    setPickerVisible(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeEP = () => {
    setPickerVisible(false);
  }

  return (
    false ? <Card className={classes.root}>
      <CardHeader className={classes.chatheaders}
        avatar={
          <Avatar></Avatar>
        }
        action={
          <CardActions>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="inherit">
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <NotificationsActiveIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Turn on notifications</Typography></MenuItem>
              <MenuItem onClick={handleClose}><ListItemIcon>
                <StarBorderIcon fontSize="small" />
              </ListItemIcon>
                <Typography variant="inherit">Rate this conversation</Typography></MenuItem>
            </Menu>
          </CardActions>
        }
        title="Somebody"
      />
      <Scrollbars style={{ width: "100%", height: "100%" }}>
        <CardContent className={classes.chatbody}>
          <Typography variant="body2" color="textSecondary" component="p" className={true ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread and also
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className={false ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className={true ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread and also the other thing that happened is all
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className={true ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread and also
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className={false ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className={true ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread and also
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className={false ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className={true ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread and also
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className={false ? classes.chatmessage : classes.chatreceiver}>
            Lizards are a widespread
          </Typography>
        </CardContent>
      </Scrollbars>

      {pickerVisible && <div className={classes.emojipicker} onClose={closeEP}><EmojiPicker onEmojiClick={handleEmojiClick} /></div>}
      <div className={classes.chatfooter}>
        <IconButton className={classes.emojiicon} onClick={handleEmojiVisibility}>
          <InsertEmoticonIcon />
        </IconButton>
        <form className={classes.chatfooterform}>
          <TextField required id="standard-required" InputProps={{ disableUnderline: true }}
            rowsMax={4} value={input} onChange={(e) => setInput(e.target.value)} className={classes.chatinput} placeholder="Enter your message..." />
          <button className={classes.chatsend} type="submit" onClick={sendMessage}>send</button>
        </form>
      </div>
    </Card> : <Card className={classes.root}>
      <CardContent>
        <Register/>
      </CardContent>
    </Card>
  );
}

export default Chatwindow;