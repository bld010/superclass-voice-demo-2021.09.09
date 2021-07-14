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
        method: 'POST', 
        numDigits: '1'
    })

    gather.say(
        `Welcome and thank you for calling the Superclass Poll.
        Today's poll is about an age-old debate at Twilio: cake versus pie.
        Press 5 if you prefer cake.
        Press 6 if you prefer pie.`
    )


    twiml.say(`You didn't answer the poll. Goodbye.`);
    twiml.hangup();

    return twiml.toString();
}

router.post("/pollResponse", (request, response) => {

    const vote = request.body.Digits;
    const callSid = request.body.CallSid;
    saveVote(vote, callSid);

    response.type("xml");
    
    const pollResponseTwiML = generatePollResponseTwiML(vote);

    response.send(pollResponseTwiML);
})



function generatePollResponseTwiML(vote) {
    const twiml = new VoiceResponse();

    if (vote === '5' || vote === '6') {
        const pollChoice = vote === '5' ? 'Cake is superior.' : 'Pie is amazing.'

        twiml.say(
            `Your vote has been recorded. Your choice was ${pollChoice}
            If you would like to leave a message about why you chose cake or pie, 
            Please record your message after the beep. Otherwise, you may hang up.`
        )

        twiml.pause();

        twiml.record({
            recordingStatusCallback: '/recordingStatus', 
            transcribe: true,
            transcribeCallback: '/transcribe'
        })
    } else {
        twiml.say(`You entered an invalid choice. Goodbye.`)
        twiml.hangup();
    }

    return twiml.toString();
}












router.post("/transcribe", (request, response) => {
    const transcriptionText = request.body.TranscriptionText;

    response.end();
})

router.post("/recordingStatus", (request, response) => {

    const recordingStatusBody = request.body;

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

function saveRecordingUrl(requestBody) {
    const voteIndex = votes.findIndex(vote => vote.callSid == requestBody.CallSid);
    votes[voteIndex].recordingUrl = `${requestBody.RecordingUrl}.mp3`;
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
