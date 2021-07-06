const Router = require('express').Router;
const { 
    generateWelcomeCallerTwiML, 
    generateSuccessfulPollResponseTwiML, 
    generateLeaveMessageTwiML,
    generateHangupTwiML 
} = require('./handler');
const cors = require('cors');

const router = new Router();
const votes = [];

router.post("/welcome", (req, res) => {
    // TwiML is just Twilio's special type of XML, so all of the
    // responses we want to send to Twilio will be in text/xml format
    res.set("Content-Type", "text/xml");

    // what does a request look like? what is Twilio sending us?
    console.log('Body of POST request from Twilio: ', req.body)

    const welcomeCallerTwiML = generateWelcomeCallerTwiML();

    console.log("welcomeTwiml: ", welcomeCallerTwiML);


    res.send(welcomeCallerTwiML);
})

router.post("/pollResponse", (req, res) => {

    //what info are we getting here?
    console.log('request body: ', req.body);

    //I want to keep track of the responses
    // for simplicity's sake, I'll just be saving 
    // the interesting information in an array

    // the callSid is useful, since we can look up
    // the call resource in the Twilio Console
    // and it can help us debug issues and find resources
    // associated with that call, like a recording

    const digit = req.body.Digits;
    const callSid = req.body.CallSid;
    const fromNumber = req.body.From;

    // place the call in my votes array
    votes.push({
        vote: digit,
        callSid,
        fromNumber,
        // recordingUrl: null
    })

    // we could just end the call there, 
    // but I want to let a caller know
    // that their vote was successful.
    // so I'm going to create a another function
    // to return some TwiML 
    // lets call it generateSuccessfulPollResponseTwiML
    // and import it at the top of this file.

    res.send(generateSuccessfulPollResponseTwiML(digit));
})

router.post("/leaveMessage", (req, res) => {
    const digit = req.body.Digits;
    if (digit) {
        res.send(generateLeaveMessageTwiML(digit));
    } else {
        
        res.send(generateHangupTwiML());
    }
})

router.post("/recordingStatusCallback", (req, res) => {
    console.log(req.body.CallSid);
    console.log('votes: ', votes)
    const voteIndex = votes.findIndex(vote => vote.callSid == req.body.CallSid);
    console.log('voteIndex: ', voteIndex)
    votes[voteIndex].recordingUrl = `${req.body.RecordingUrl}.mp3`;
    res.end();
})



// this is so my frontend application can GET our responses
router.get("/pollResponses", cors(), (req, res) => {
    res.set("Content-Type", "application/json");
    res.send({
        votes
    })
})

module.exports = router;