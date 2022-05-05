var express = require('express');
const functions = require('firebase-functions');
const axios = require('axios');
const { enterpriseApi, sendMessageApi } = require('./public/constants');

var app = express();
// var port = process.env.PORT || 3000;

app.get('/getTemplates', async (req, res) => {
  const d = await axios.get(
    `${enterpriseApi}rest?method=get_whatsapp_hsm&userid=${req.query.username}&auth_scheme=plain&password=${req.query.password}&v=1.1&format=JSON`
  );
  console.log(d.data);
  res.status(200).send(d.data);
});

app.get('/sendMessage', async (req, res) => {
  // let sendMsgUrl = `${sendMessageApi}rest?method=SendMessage&format=json&userid=${req.query.user_id}&password=${req.query.password}&send_to=${req.query.phone_number}&v=1.1&auth_scheme=plain&msg_type=HSM&msg=${req.query.message}`;

  // let optInUrl = `${sendMessageApi}rest?method=OPT_IN&format=json&userid=${req.query.user_id}&password=${req.query.password}&phone_number=${req.query.phone_number}&v=1.1&auth_scheme=plain&channel=WHATSAPP`;

  console.log('here at get api')
  const url = 'https://media.smsgupshup.com/GatewayAPI/rest?method=SendMessage&format=json&userid=2000203297&password=qFx2dPXV&send_to={{Contact.Attribute.TestDataByGupshup.Mobile}}&v=1.1&auth_scheme=plain&msg_type=HSM&msg=Welcome%20to%20Gupshup.%20Click%20on%20the%20link%20below%20to%20continue%20https%3A%2F%2Fwww.gupshup.io%2Fdeveloper%2Fhome';


  const sendMsgResp = await axios.get(url);
  // console.log(sendMsgResp.data);
  // if (sendMsgResp.data.response.id === '315') {
  //   await axios.get(optInUrl);
  //   const smResp = await axios.get(sendMsgUrl);
  //   return res.status(200).send(smResp.data);
  // }
  res.status(200).send(sendMsgResp.data);
});


app.post('/sendMessage',  async (req, res) => {
  console.log('here at post api')
  let sendMsgUrl = `${sendMessageApi}rest?method=SendMessage&format=json&userid=${req.query.user_id}&password=${req.query.password}&send_to=${req.query.phone_number}&v=1.1&auth_scheme=plain&msg_type=HSM&msg=${req.query.message}`;
  let optInUrl = `${sendMessageApi}rest?method=OPT_IN&format=json&userid=${req.query.user_id}&password=${req.query.password}&phone_number=${req.query.phone_number}&v=1.1&auth_scheme=plain&channel=WHATSAPP`;
  const sendMsgResp = await axios.get(sendMsgUrl);
  console.log(sendMsgResp.data);
  if (sendMsgResp.data.response.id === '315') {
    await axios.get(optInUrl);
    const smResp = await axios.get(sendMsgUrl);
    return res.status(200).send(smResp.data);
  }
  res.status(200).send(sendMsgResp.data);
});

app.use(express.static('public'));

// app.listen(port, () => console.log(`App listening on port ${port}!`));

exports.sfmcapp = functions.https.onRequest(app);
