const Router = require('express').Router;
const cors = require('cors');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const router = new Router();
const votes = [];





router.post("/welcome", (request, response) => {
    
})











// this is so my frontend application can GET our responses
router.get("/pollResponses", cors(), (request, response) => {
    response.set("Content-Type", "application/json");
    response.send({
        votes
    })
})

module.exports = router;