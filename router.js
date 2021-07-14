const Router = require('express').Router;
const cors = require('cors');
const router = new Router();

const votes = [];

const VoiceResponse = require('twilio').twiml.VoiceResponse;




router.post("/welcome", (request, response) => {

})

function generateWelcomeCallerTwiml() {

}

router.post('/pollResponse', (request, response) => {
    
})

function generatePollResponseTwiML(vote) {

}


// router.post("/transcribe", (request, response) => {
//     console.log('transcribe: ', request.body.TranscriptionText);
//     response.end();
// })

// router.post("/recordingStatus", (request, response) => {
//     saveRecordingUrl(request.body);
    
//     response.end();
// })















// saving votes and recordings to display on frontend application
function saveRecordingUrl(requestBody) {
    const voteIndex = votes.findIndex(vote => vote.callSid == requestBody.CallSid);
    votes[voteIndex].recordingUrl = `${requestBody.RecordingUrl}.mp3`;
}

function saveVote(vote, callSid) {
    votes.push({
        vote,
        callSid,
        recordingUrl: null
    })
}


// this is so my frontend application can GET our responses
router.get("/pollResponses", cors(), (request, response) => {
    response.set("Content-Type", "application/json");
    response.send({
        votes
    })
})

module.exports = router;