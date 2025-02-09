const express = require("express");
const app = express();
var https = require('https')
var fs = require('fs')
const cors = require("cors");
const bodyParser = require('body-parser')
const axios = require('axios')
require("dotenv").config({ path: "./config.env" });
//const port = process.env.PORT || 80;
app.use(cors());
app.use(express.json());
app.use(require("./routes/dbapi"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// get driver connection
const dbo = require("./db/conn");

app.listen(443, () => {
  console.log('Running server.')
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  })

});

const stripe = require('stripe')(process.env.STRIPE_API_KEY)
app.post('/create-checkout-session', async (req, res) => {
  // Creating a new stripe checkout session.
  console.log(req.body)
  const session = await stripe.checkout.sessions.create({
    customer_email: req.body.email,
    line_items: [{
      price: 'price_1KEOMhCOL3X1doeXxRmWdA1U',
      quantity: req.body.maskAmnt,
    }],
    mode: 'payment',
    success_url: `https://donatemask.ca/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'https://donatemask.ca/cancel',
    metadata: {
      name: req.body.name,
      email: req.body.email,
      maskAmnt: parseInt(req.body.maskAmnt),
      msg: req.body.donationMsg,
      timestamp: new Date(),
    }
  });

  res.redirect(303, session.url);
});

app.get('/order/success', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  // Extracting payload, converting mask amount to int.
  const payload = session.metadata
  payload.maskAmnt = parseInt(payload.maskAmnt)

  // Updating the database on a successful checkout with donation information.
  axios.post('https://donatemask.ca/api/donation_add', payload)
  .then(res => console.log('success'))
  .catch(error => console.log(error))
  res.redirect('https://donatemask.ca/donate?success=true')
});

// Handles wildcard requests, ensures direct links with routing works.
app.get('*',(req, res) => {
        res.sendFile('/home/donatemask/donatemask.ca/public/index.html');
    });
