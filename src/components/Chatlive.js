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
import StarIcon from '@material-ui/icons/Star';
import { Scrollbars } from 'react-custom-scrollbars';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EmojiPicker from 'emoji-picker-react';
import '../custom_EmojiPicker.css';
import axios from 'axios';
import { yellow } from '@material-ui/core/colors';


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
    moreOptions:{
        '&:hover': {
            background: "#425B76",
            color: "#ffffff"
         },
    },
    notificationicons:{
        '&:hover': {
            color: "#ffffff"
         },
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
        borderRadius:"10px 10px 10px 0px",
        width: "fit-content",
        marginBottom: "30px",
        maxWidth: "95%"
    },
    chatmessage: {
        position: "relative",
        fontSize: "16px",
        padding: "10px",
        color: "#ffffff",
        borderRadius:"10px 10px 0px 10px",
        width: "fit-content",
        marginBottom: "30px",
        marginLeft: "auto",
        backgroundColor: "#33475b",
        maxWidth: "95%"
    },
    emojipicker: {
        position: 'absolute',
        bottom: theme.spacing(7),
        right: theme.spacing(5)
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
    },
    paper:{
        marginLeft:"10%",
        marginRight: "8px",
        width:"80%",
        marginBottom:"15px"
    },
    ratingheader:{
        backgroundColor: "#496583",
        color: "#ffffff",
        paddingLeft: "5%",
        paddingTop:"2%",
        paddingBottom:"2%"
    },
    ratingreply:{
        color:"#425b76"
    },
    ratingcomment:{
        marginTop:"10px",
    },
    ratecommentinput:{
        height:"35px",
        width:"97%"
    }
}));

const api = axios.create({baseURL:'http://localhost:5000/visitor/'});

const Chatlive = (props) => {
    
    const classes = useStyles();
    const [input, setInput] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [pickerVisible, setPickerVisible] = React.useState(false);
    const {chatMessages, setChatMessages, assignedAgentName, notifyme, setNotifyme, handleEmittedMessage, offline, ioconnected} = props;
    const [goodMessage, setGoodMessage] = React.useState(true);
    const [commentbox, setCommentBox] = React.useState(false);
    const [inputComment, setInputComment] = React.useState("");
    const [commentDisable, setCommentDisable] = React.useState(false);
    const scrollbars = React.useRef(null);

    React.useEffect(() => {
        const token = localStorage.getItem('conversationToken');
        if (token) {
            console.log(token);
            api.get('/history', {
                params: {
                    fetchedHistoryCount: "2",
                    conversationID: token
                }
            }).then(res => {
                if (res.data.success) {
                    const temp = res.data.data.history;
                    for (let j = 0; j < temp.length; j++) {
                        if (temp[j].sender.agent) {
                            const msga = { text: temp[j].text, sender: temp[j].sender, incomming: true };
                            setChatMessages(chatMessages => [...chatMessages, { msg: msga }]);
                        }
                        else if (temp[j].sender.visitor) {
                            const msgv = { text: temp[j].text, sender: temp[j].sender, incomming: false };
                            setChatMessages(chatMessages => [...chatMessages, { msg: msgv }]);
                        }
                    }
                    scrollbars.current.scrollToBottom();
                }
            })
        }
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        scrollbars.current.scrollToBottom();
        if(input && ioconnected) {
            const msg = { text: input, sender: [{visitor:true}]};
            const msgv = { text: input, sender: [{visitor:true}], incomming:false};
            setChatMessages(chatMessages => [ ...chatMessages, {msg:msgv}]);
            handleEmittedMessage(msg);
            setInput("");
            setPickerVisible(false);
        }     
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
    }

    const handleRating = () => {
        // if previously attempted to rate then remove that first
        setInputComment("");
        setCommentDisable(false);
        const lst = [...chatMessages];
        for (let i = 0; i < lst.length; i++) {
            if (lst[i]["rating"] === true) {
                lst.splice(i, 1);
            }
        }
        setChatMessages(lst);
        setChatMessages(chatMessages => [ ...chatMessages, {rating:true}]);
        setAnchorEl(null);
        setCommentBox(false);
    };

    // to close the emoji picker
    const closeEP = () => {
        setPickerVisible(false);
        setAnchorEl(null);
    }

    const handleNotification = () => {
        setNotifyme(!notifyme);
        localStorage.setItem('notificationstate',!notifyme);
        setAnchorEl(null);
    }

    const onGoodRating = () => {
        setCommentBox(true);
        setGoodMessage(true);
    }

    const onPoorRating = () => {
        setCommentBox(true);
        setGoodMessage(false);
    }

    const commentEntered = (e) => {
        if(e.key === 'Enter'){
            setCommentDisable(true);
        }
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
                            <MenuItem className={classes.moreOptions} onClick={handleNotification}>
                                <ListItemIcon>
                                 {notifyme ? <NotificationsActiveIcon style={{color: "#b3b3b3"}} fontSize="small"/> : <NotificationsOffIcon style={{color: "#b3b3b3"}} fontSize="small"/>}
                                </ListItemIcon>
                        {notifyme ? <Typography variant="inherit">Turn off notifications</Typography> : <Typography  variant="inherit">Turn on notifications</Typography>}</MenuItem>
                            <MenuItem className={classes.moreOptions} onClick={handleRating}><ListItemIcon>
                                <StarIcon style={{color: yellow[600]}} fontSize="small" />
                            </ListItemIcon>
                                <Typography variant="inherit">Rate this conversation</Typography></MenuItem>
                        </Menu>
                    </CardActions>
                }
                titleTypographyProps={{variant:'h6' }}
                title={assignedAgentName}
                subheaderTypographyProps={{color:'inherit'}}
                subheader={offline}
            />
            <Scrollbars ref={scrollbars} style={{ width: "100%", height: "100%" }} key="thescrollbar">
                 <CardContent className={classes.chatbody}>
                    {chatMessages.map((msgitem, idx) => {                
                    return msgitem.rating ? <Paper className={classes.paper} key={idx}>
                        <Paper>
                    <MenuList>
                      <Typography className={classes.ratingheader} >Did you find this conversation helpful?</Typography>
                      {!commentbox && <MenuItem className={classes.ratingreply} onClick={onGoodRating}>Yes, I did!</MenuItem>}
                      {!commentbox && <MenuItem className={classes.ratingreply} onClick={onPoorRating}>No, I'm not satisfied.</MenuItem>}
                    </MenuList>
                    </Paper>
                    <Paper>
                   {commentbox && <MenuList className={classes.ratingcomment}>
                     {!goodMessage && <Typography className={classes.ratingheader} >We're really sorry to hear that<span role="img" aria-label="sademoji">&#128549;</span>... what can we do to improve? </Typography>}
                     {goodMessage && <Typography className={classes.ratingheader} >That's great!<span role="img" aria-label="happyemoji">&#128525;</span> Would you like to leave an additional comment?</Typography>}
                        <input type="text" disabled={commentDisable} placeholder=" Type your comment here... " value={inputComment} onKeyPress={commentEntered} onChange={(e)=>{setInputComment(e.target.value)}} className={classes.ratecommentinput}/>
                    </MenuList>}
                    </Paper>
                  </Paper> : <Typography variant="body2" color="textSecondary" key={idx} component="p" className={msgitem.msg.incomming ? classes.chatreceiver : classes.chatmessage}>
                         {msgitem.msg.text} </Typography>
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