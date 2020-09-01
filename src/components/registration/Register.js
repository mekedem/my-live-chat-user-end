import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import useStyles from './registerFormStyle';
import Container from '@material-ui/core/Container';

export default function Register(props) {
  const classes = useStyles();
  const [userEmail, setUserEmail] = React.useState('');
  const [checked, setChecked] = React.useState(false);

  const handleOnChangeEmail = (e) => {
    setUserEmail(e.target.value);
  }
  
  const handleCheckedIcon = () => {
    setChecked(!checked)
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const startChat = (e) => {
    e.preventDefault();
    if (validateEmail(userEmail) && checked) {
      props.handleStartConversation(userEmail);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.welcome}>
              <Box p={6}>
                <Typography variant="body1">
                  Welcome to our Live Chat
                  Please fill in the form below
                  before starting the chat
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                type="email"
                label="Email Address"
                name="email"
                value={userEmail}
                onChange={handleOnChangeEmail}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Checkbox
                color="default"
                inputProps={{ 'aria-label': 'checkbox with default color' }}
                onChange={handleCheckedIcon}
                checked={checked}
              />
            </Grid>
            <Grid item xs={12} sm={10}>
              <Typography variant="body2">
                Terms and agreement welcome to our Live Chat
                Please fill in the form below
                before starting the chat Please fill in the form below
                before st Please fill in the form below
                before starting the chat Please fill in the form below
                before starting the chat
              </Typography>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={startChat}
            className={classes.submit}>
              START
          </Button>
        </form>
      </div>
    </Container>
  );
}
