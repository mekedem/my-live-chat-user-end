import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
    margin: theme.spacing(3, 0, 2),
  },
  welcome: {
    paddingLeft: "20px"
  }
}));

export default function Register() {
  const classes = useStyles();

  const startChat = (e) => {
    e.preventDefault();
  
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} Validate>
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
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
            <Checkbox
        checked={false}
        inputProps={{ 'aria-label': 'primary checkbox' }}
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
            color="primary"
            onClick={startChat}
            className={classes.submit}
          >
            Send
          </Button>
        </form>
      </div>

    </Container>
  );
}
