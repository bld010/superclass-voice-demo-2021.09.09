const Router = require('express').Router;
const { welcome, pollResponse, leaveMessage } = require('./handler');

const router = new Router();
const digits = [];
const recordingUrls = [];

router.post("/welcome", (req, res) => {
    res.set("Content-Type", "text/xml");
    res.send(welcome());
})

router.post("/pollResponse", (req, res) => {
    const digit = req.body.Digits;
    digits.push(digit);
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
    recordingUrls.push(`${req.body.RecordingUrl}.mp3`);
    res.end();
})

router.get("/pollResponses", (req, res) => {
    res.set("Content-Type", "application/json");
    res.send({
        digits,
        recordingUrls
    })
})

module.exports = router;