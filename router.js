const Router = require('express').Router;
const router = new Router();
const cors = require('cors');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const votes = [];

router.post("/welcome", (request, response) => {
    response.type("xml");

    const welcomeCallerTwiML = generateWelcomeCallerTwiML();

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

    twiml.say(
        `You didn't answer the poll. I'll assume you love pie. Goodbye!`
    );
    twiml.hangup();

    return twiml.toString();
}

router.post("/pollResponse", (request, response) => {
    response.type("xml");
    
    const vote = request.body.Digits;
    const callSid = request.body.CallSid;    
    
    saveVote(vote, callSid);
   
    const pollResponseTwiML = generatePollResponseTwiML(Digits);
    
    response.send(pollResponseTwiML);
})

function saveVote(vote, callSid) {
    votes.push({
        vote,
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
        twiml.say(
            `Your vote has been recorded. Your choice was ${pollChoices[digit]}
            If you would like to leave a message about why you chose cake or pie, 
            Please record your message after the beep. Otherwise, you may hang up.`
        );
        twiml.pause();
        twiml.record({
            recordingStatusCallback: '/recordingStatus',
            transcribe: true,
            transcribeCallback: '/transcribe'
        })
    } else {
        twiml.say(`You entered an invalid choice. Goodbye!`)
        twiml.hangup();
    }

    return twiml.toString();
}

// router.post("/transcribe", (request, response) => {
//     console.log('transcribe: ', request.body);
//     response.end();
// })

router.post("/recordingStatus", (request, response) => {
    saveRecordingUrl(request.Body);

    response.end();
})

function saveRecordingUrl(requestBody) {
    const voteIndex = votes.findIndex(vote => vote.callSid == requestBody.CallSid);
    votes[voteIndex].recordingUrl = `${requestBody.RecordingUrl}.mp3`;
}














// this is so my frontend application can GET our responses
router.get("/pollResponses", cors(), (request, response) => {
    response.set("Content-Type", "application/json");
    response.send({
        votes
    })
})

module.exports = router;