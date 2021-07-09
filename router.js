const Router = require('express').Router;
const cors = require('cors');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const router = new Router();
const votes = [];





router.post("/welcome", (request, response) => {
    response.set("Content-Type", "text/xml");
    const welcomeCallerTwiML = generateWelcomeCallerTwiML();
    console.log("welcomeCallerTwiML: ", welcomeCallerTwiML)
    response.send(welcomeCallerTwiML);
})

function generateWelcomeCallerTwiML() {

    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        action: '/pollResponse',
        numDigits: '1', 
        method: 'POST',
    });

    gather.pause();

    gather.say(
        `Welcome and thank you for calling the Superclass Poll.
        Today's poll is about an age-old debate at Twilio: cake versus pie.
        Press 5 if you prefer cake.
        Press 6 if you prefer pie.`
    );

    return twiml.toString();
}










router.post("/pollResponse", (request, response) => {
    response.set("Content-Type", "text/xml");
    
    const digit = request.body.Digits;
    const callSid = request.body.CallSid;
    
    saveVote(digit, callSid);
    
    const pollResponseTwiML = generatePollResponseTwiML(digit);
    
    response.send(pollResponseTwiML);
})

function saveVote(digit, callSid) {
    votes.push({
        vote: digit,
        callSid,
        recordingUrl: null
    })
}

function generatePollResponseTwiML(digit) {
        
    const pollChoices = {
        '5': 'Cake is superior. ',
        '6': 'Pie is amazing.'
    }
    let twiml = new VoiceResponse();

    if (digit === '5' || digit === '6') {
        twiml.say('Your vote has been recorded.');
        twiml.say(`Your choice was ${pollChoices[digit]}`);
        twiml.say(
            `If you would like to leave a message about why you chose cake or pie, 
            Please record your message after the beep. Otherwise, you may hang up.`
        )
        twiml.pause();
        twiml.record({
            recordingStatusCallback: '/recordingStatus',
            timeout: 30,
            transcribe: true,
            transcribeCallback: '/transcribe'
        })
        return twiml.toString();
    } else {
        twiml.hangup();
        return twiml.toString();
    }
}


router.post("/transcribe", (request, response) => {
    console.log('transcribe: ', request.body);
    response.end();
})

router.post("/recordingStatus", (request, response) => {
    const voteIndex = votes.findIndex(vote => vote.callSid == request.body.CallSid);
    votes[voteIndex].recordingUrl = `${request.body.RecordingUrl}.mp3`;
    response.end();
})









// this is so my frontend application can GET our responses
router.get("/pollResponses", cors(), (request, response) => {
    response.set("Content-Type", "application/json");
    response.send({
        votes
    })
})

module.exports = router;