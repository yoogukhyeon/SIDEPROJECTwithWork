var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const models = require("../models");
const checkAuthenticated = require('../passport/authenticated')
// google library
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '106207884023-178d9gn0ksops7o547vb8dsekgpiimb6.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

/* GET home page. */
router.get('/' , async (req, res) => {
  res.render('login');
});

router.get('/dashboard'  , checkAuthenticated ,  async (req, res) => {
  try{
    let user = req.user;
    console.log('user :::::::::::::::::' , user)
    res.render('dashboard' , {
      user
    });
  }catch(e){
    console.error('Error' , e)
  }
})

/* GET users listing. */
router.post('/googleLogin' , (req , res) => {
  let token = req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload)
    console.log(userid)
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  verify()
  .then(() => {
      res.cookie('session-token' ,token);
      res.send('success');
  })
  .catch(console.error);
})


router.get('/logout'   , (req , res) => {
  res.clearCookie('session-token');
  res.render('login')
})



module.exports = router;
