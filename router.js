const Router = require('express').Router;
const router = new Router();

const VoiceResponse = require('twilio').twiml.VoiceResponse;


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
   
    const pollResponseTwiML = generatePollResponseTwiML(vote);
    
    response.send(pollResponseTwiML);
})



function generatePollResponseTwiML(vote) {
            
    let twiml = new VoiceResponse();
    
    if (vote === '5' || vote === '6') {
        const pollChoice = vote === '5' ? 'Cake is superior.' : 'Pie is amazing.'
        twiml.say(
            `Your vote has been recorded. Your choice was ${pollChoice}
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

router.post("/transcribe", (request, response) => {
    const transcriptionText = request.body.TranscriptionText;
    console.log("\n\n\n ---------------------------------------------");
    console.log("\n\n\n   transcriptionText", transcriptionText);
    console.log("\n\n\n ---------------------------------------------");

    response.end();
})

router.post("/recordingStatus", (request, response) => {

    const recordingStatusBody = request.body;
    console.log("\n\n\n -------------------------------------------------");
    console.log("\n\n\n   recordingStatusBody", recordingStatusBody);
    console.log("\n\n\n -------------------------------------------------");
    saveRecordingUrl(request.body);

    response.end();
})







const votes = [];

function saveVote(vote, callSid) {
    if (vote === "5" || vote === "6") {
        votes.push({
            vote,
            callSid,
            recordingUrl: null
        })
    }
}

function saveRecordingUrl({ CallSid, RecordingUrl }) {
    const voteIndex = votes.findIndex(vote => vote.callSid == CallSid);
    votes[voteIndex].recordingUrl = `${RecordingUrl}.mp3`;
}













// this is so my frontend application can GET our responses
const cors = require('cors');
router.get("/pollResponses", cors(), (request, response) => {
    response.set("Content-Type", "application/json");
    response.send({
        votes
    })
})

module.exports = router;