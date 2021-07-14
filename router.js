const Router = require('express').Router;
const router = new Router();


const VoiceResponse = require('twilio').twiml.VoiceResponse;


router.post("/welcome", (request, response) => {
   
})

function generateWelcomeCallerTwiML() {


}

router.post('/pollResponse', (request, response) => {
    
})

function generatePollResponseTwiML(vote) {
    
}









router.post("/transcribe", (request, response) => {

    const transcriptionText = request.body.TranscriptionText;
    console.log("\n\n\n ---------------------------------------------");
    console.log("\n\n\n   transcriptionText", transcriptionText);
    console.log("\n\n\n ---------------------------------------------");

    response.end();
})
    
router.post("/recordingStatus", (request, response) => {
    const recordingStatusRequestBody = request.body;
    console.log("\n\n\n ---------------------------------------------------------------");
    console.log("\n\n\n   recordingStatusRequestBody", recordingStatusRequestBody);
    console.log("\n\n\n ---------------------------------------------------------------");
    
    saveRecordingUrl(request.body);
    

    response.end();
})
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
// saving votes and recordings to display on frontend application
const votes = [];

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
const cors = require('cors');
router.get("/pollResponses", cors(), (request, response) => {
    response.set("Content-Type", "application/json");
    response.send({
        votes
    })
})

module.exports = router;