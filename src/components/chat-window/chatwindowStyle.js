import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 450,
      height: 550,
      display: "flex",
      flexDirection: "column",
      borderRadius: "16px"
    }
  }));

export default useStyles;