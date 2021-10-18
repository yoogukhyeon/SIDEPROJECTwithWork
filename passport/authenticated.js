//gogle auath
const express = require('express')
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '106207884023-178d9gn0ksops7o547vb8dsekgpiimb6.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

module.exports = function checkAuthenticated(req , res , next){
    let token = req.cookies['session-token'];
    let user = {}

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        user.name = payload.name
        user.email = payload.email
        user.picture = payload.picture
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
      }
      verify()
      .then(() => {
            req.user = user;
            next();
      })
      .catch(err => {
        res.redirect('/');
      });
}