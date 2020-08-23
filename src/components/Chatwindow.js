import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Register from './Register';
import Chatlive from './Chatlive';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 450,
    height: 550,
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px"
  }
}));

const Chatwindow = (props) => {

  const [userEmail, setUserEmail] = React.useState('');
  const classes = useStyles();

  const passEmail = (email) => {
    setUserEmail(email);
  }

  return (
    !props.firstTime ? <Chatlive userEmail={userEmail} isFirstTime={props.firstTime}/> : <Card className={classes.root}>
      <CardContent>
        <Register handleFirstTime={props.handleFirstTime} passEmail={passEmail}/>
      </CardContent>
    </Card>
  );
}

export default Chatwindow;