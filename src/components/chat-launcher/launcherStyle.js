import { makeStyles } from '@material-ui/core/styles';

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
      '&:hover': {
        color: "#ffffff",
        backgroundColor:'#405872'
     },
      color:'#ffffff',
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(3),
      backgroundColor:'#405872'
    },
  }));

export default useStyles;