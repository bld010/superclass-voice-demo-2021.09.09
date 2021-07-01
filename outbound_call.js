// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myCallerId = process.env.TWILIO_CALLER_ID;
const twilio = require('twilio');
var client = new twilio(accountSid, authToken)


const makeOutgoingCall = async () => {
    let call = await client.calls.create({
        twiml: '<Response><Say>Ahoy, World!</Say></Response>',
        to: '+17204601666‬',
        from: myCallerId
      })
    console.log('call: ', call)
}

makeOutgoingCall(); 



