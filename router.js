const Router = require('express').Router;
const router = new Router();

const VoiceResponse = require('twilio').twiml.VoiceResponse;


router.post("/welcome", (request, response) => {

})

function generateWelcomeCallerTwiML() {

}

router.post("/pollResponse", (request, response) => {

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