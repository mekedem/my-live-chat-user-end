import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    submit: {
      "&:hover": {
        backgroundColor: "#425B76",
        color: "#ffffff"
     },
      margin: theme.spacing(3, 0, 2),
      backgroundColor: "#425B76",
      color:"#ffffff",
      textTransform: "none"
    },
    welcome: {
      paddingLeft: "20px"
    }
  }));


export default useStyles;