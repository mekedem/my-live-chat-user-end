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
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Scrollbars } from 'react-custom-scrollbars';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EmojiPicker from 'emoji-picker-react';
import './custom_EmojiPicker.css';
import io from "socket.io-client";
import {GETANAGENT, AGENTASSIGNED, OFFLINE, TOKEN, MESSAGE} from '../Events.js';

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
    chatreceiver: {
        position: "relative",
        fontSize: "16px",
        backgroundColor: "#EAF0F6",
        padding: "10px",
        color: "#33475b",
        borderRadius: "10px",
        width: "fit-content",
        marginBottom: "30px"
    },
    chatmessage: {
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
    emojipicker: {
        position: 'absolute',
        bottom: theme.spacing(7),
        right: theme.spacing(2.2)
    },
    chatfooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "62px",
    },
    emojiicon: {
        padding: "15px"
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
    }
}));

let socket;
let visitorQuery = { usertype: 'visitor', agency: 'telegram' };

const Chatlive = (props) => {
    
    const ENDPOINT = 'http://localhost:5000';
    const classes = useStyles();
    const [input, setInput] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [pickerVisible, setPickerVisible] = React.useState(false);
    const {isFirstTime, chatMessages, setChatMessages, assignedAgentName, setAssignedAgentName, setNotificationCount, notifyme, setNotifyme} = props;
    const [ioconnected, setioconnected] = React.useState(false);
    const scrollbars = React.useRef(null);

    // need to send token from cookie
    React.useEffect(() => {
        const token = getCookie('conversationToken');
        socket = io(ENDPOINT, { query: { ...visitorQuery, token }, forceNew: true });
        socket.emit(GETANAGENT,{}, (error) => {
          if(error) {
            alert(error);
            setioconnected(false);
          }
        });
      }, [ENDPOINT, isFirstTime]);

    React.useEffect(() => {
        socket.on(AGENTASSIGNED, ({ name, avatarURL }) => {
        setAssignedAgentName(name);
        //   props.setAvatarURL(avatarURL);
        });
        
        socket.on(MESSAGE, ({ body, time }) => {
            const incomming = {incomming : true};
            setChatMessages(chatMessages => [ ...chatMessages, {body,time,incomming} ]);
            scrollbars.current.scrollToBottom();
            setNotificationCount(notificationCount => notificationCount + 1);        
        });

        socket.on(OFFLINE, () => {
            // console.log("all agents are offline so nothing is coming");
        });

        socket.on(TOKEN, ({ token }) => {
            setCookie('conversationToken', token, 365);
        });

        socket.on('connect', () => {
            setioconnected(true);
            console.log('socket connected');
        });

        socket.on('error', (err) => {
            console.log(err);
        })
    }, []);

    const setCookie = (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    const getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if(input && ioconnected) {
            const msg = { body: input, time: Date.now(), incomming: false};
            socket.emit(MESSAGE, msg);
            setChatMessages(chatMessages => [ ...chatMessages, msg ]); // push msg later on
            scrollbars.current.scrollToBottom();
            setInput("");
            setPickerVisible(false);
        }
        // console.log("no connection or empty message")
        // console.log(props.userEmail); the visitors email he enters at the beginning     
    }

    // toggle emoji picker visibility
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

    // options icon on the header of the chat window
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // options icon on close header of the chat window
    const handleClose = () => {
        setAnchorEl(null);
    };

    // to close the emoji picker
    const closeEP = () => {
        setPickerVisible(false);
        setAnchorEl(null);
    }

    const handleNotification = () => {
        setNotifyme(!notifyme);
        setAnchorEl(null);
    }

    return (
        <Card className={classes.root}>
            <CardHeader className={classes.chatheaders}
                avatar={
                    <Avatar ></Avatar>
                    // src={props.avatarURL}
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
                            }}>
                            <MenuItem onClick={handleNotification}>
                                <ListItemIcon>
                                 {notifyme ? <NotificationsActiveIcon fontSize="small"/> : <NotificationsOffIcon fontSize="small"/>}
                                </ListItemIcon>
                        {notifyme ? <Typography variant="inherit">Turn off notifications</Typography> : <Typography variant="inherit">Turn on notifications</Typography>}</MenuItem>
                            <MenuItem onClick={handleClose}><ListItemIcon>
                                <StarBorderIcon fontSize="small" />
                            </ListItemIcon>
                                <Typography variant="inherit">Rate this conversation</Typography></MenuItem>
                        </Menu>
                    </CardActions>
                }
                title={assignedAgentName}
                subheader="time"
            />
            <Scrollbars ref={scrollbars} style={{ width: "100%", height: "100%" }}>
                 <CardContent className={classes.chatbody}>
                    {chatMessages.map((msgitem) => {                
                    return <Typography variant="body2" color="textSecondary" key={chatMessages.indexOf(msgitem)} component="p" className={msgitem.incomming ? classes.chatreceiver : classes.chatmessage}>
                         {msgitem.body} </Typography>      
                    })}
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
        </Card>
    );
}

export default Chatlive;