import { makeStyles } from '@material-ui/core/styles';

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

export default useStyles;