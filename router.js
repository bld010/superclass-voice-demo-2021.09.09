const Router = require('express').Router;
const { welcome, pollResponse, leaveMessage } = require('./handler');
const cors = require('cors');

const router = new Router();
const votes = [];

router.post("/welcome", (req, res) => {
    res.set("Content-Type", "text/xml");
    res.send(welcome());
})

router.post("/pollResponse", (req, res) => {
    const digit = req.body.Digits;
    const callSid = req.body.CallSid;
    const fromNumber = req.body.From;

    votes.push({
        vote: digit,
        callSid,
        fromNumber,
        recordingUrl: null
    })

    res.send(pollResponse(digit));
})

router.post("/leaveMessage", (req, res) => {
    const digit = req.body.Digits;
    if (digit) {
        res.send(leaveMessage(digit));
    } else {
        res.end();
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

router.get("/pollResponses", cors(), (req, res) => {
    res.set("Content-Type", "application/json");
    res.send({
        votes
    })
})

module.exports = router;