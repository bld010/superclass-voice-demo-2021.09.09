const Router = require('express').Router;
const router = new Router();
// This is for my frontend application: you don't need this. 
const cors = require('cors');

// This is the function from the Twilio Node helper library
// that will help us create valid TwiML for voice instructions
const VoiceResponse = require('twilio').twiml.VoiceResponse;


const votes = [];


// We configured our Twilio Phone Number to make a post
// request to this endpoint. Twilio will expect TwiML
// in return. 
router.post("/welcome", (request, response) => {

    // Express provides us with the request object
    // from the POST request. Let's look at the
    // request.Body to see what Twilio sent us:
    // console.log(request.body);

    // TwiML is a set of XML instructions
    response.set("Content-Type", "text/xml");

    const welcomeCallerTwiML = generateWelcomeCallerTwiML();
    // console.log("welcomeCallerTwiML: ", welcomeCallerTwiML)
    response.send(welcomeCallerTwiML);
})

function generateWelcomeCallerTwiML() {
    
    // Create a new instance of VoiceResponse from the helper library
    const twiml = new VoiceResponse();
    // console.log('twiml: ', twiml);


    const gather = twiml.gather({
        action: '/pollResponse',
        numDigits: '1', 
        method: 'POST',
    });

    // You can next <Say>, <Play>, and <Pause> within
    // a <Gather>

    // You can use the TwiML verb <Pause> to pause before executing the 
    // next TwiML instruction. This can help make the call
    // feel a bit more natural.
    gather.pause();

    // Once a caller hears this <Say>, they will have the default 
    // 5-second timeout to respond. Once the caller responds with input,
    // Twilio will send a POST to the action url specified
    // above (/pollResponse) and  any remaning TwiML instructions
    // below this will not be executed. Twilio will then execute
    // the TwiML returned by the /pollResponse POST call.
    gather.say(
        `Welcome and thank you for calling the Superclass Poll.
        Today's poll is about an age-old debate at Twilio: cake versus pie.
        Press 5 if you prefer cake.
        Press 6 if you prefer pie.`
    );


    // This TwiML will only be executed if the user doesn't 
    // enter any input in response to the <Gather>
    twiml.say(`You didn't answer the poll. Goodbye!`);
    twiml.hangup();

    // Stringify the twiml object, since Twilio 
    // expect TwiML/XML, not a JavaScript object.
    return twiml.toString();

    // go back up to /welcome endpoint and 
    // review what's happening
    // then test the call with no input and see the two terminal windows
    // looking for: a POST to /welcome
    // and what the TwiML looks like
    // test the call with input
    // see the 404 to the /pollResponse endpoint
    // Go back to slides that show steps 1-4
}










router.post("/pollResponse", (request, response) => {

    // Inspect the request.body to see what Twilio
    // sends to the <Gather> action url
    // console.log(request.body)

    // TwiML is XML
    response.set("Content-Type", "text/xml");
    
    // The caller's input is in the request.body
    const digit = request.body.Digits;
    // The callSid will allow us to refer to this 
    // specific call resource in the future.
    const callSid = request.body.CallSid;
    
    // I define a simple 'saveVote' function below
    saveVote(digit, callSid);

    // We handled saving the caller's vote. 
    // Now what should the user hear? We need to give
    // Twilio some more TwiML instructions.
    
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
        // twiml.say(
        //     `If you would like to leave a message about why you chose cake or pie, 
        //     Please record your message after the beep. Otherwise, you may hang up.`
        // )
        // twiml.pause();
        // twiml.record({
        //     recordingStatusCallback: '/recordingStatus',
        //     timeout: 30,
        //     transcribe: true,
        //     transcribeCallback: '/transcribe'
        // })
        return twiml.toString();
    } else {
        twiml.hangup();
        return twiml.toString();
    }
}


// router.post("/transcribe", (request, response) => {
//     console.log('transcribe: ', request.body);
//     response.end();
// })

// router.post("/recordingStatus", (request, response) => {
//     const voteIndex = votes.findIndex(vote => vote.callSid == request.body.CallSid);
//     votes[voteIndex].recordingUrl = `${request.body.RecordingUrl}.mp3`;
//     response.end();
// })









// this is so my frontend application can GET our responses
router.get("/pollResponses", cors(), (request, response) => {
    response.set("Content-Type", "application/json");
    response.send({
        votes
    })
})

module.exports = router;