const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.generateWelcomeCallerTwiML = () => {

    // this is our javascript object that we can
    // modify, then stringify to give Twilio TwiML instructions
    const twiml = new VoiceResponse();

    // want some information from a caller? Lets <Gather> some
    // caller input
    const gather = twiml.gather({
        // tell twilio what to do with the gathered information
        action: '/pollResponse',
        // Twilio should expect 1 digit of input from the user
        numDigits: '1', 
        // We're chosing POST so we can pass this information
        // to our /pollResponse endpoint
        method: 'POST',
    });

    gather.pause();

    gather.say(
        `Welcome and thank you for calling the Superclass Poll.
        Today's poll is about an age-old debate at Twilio: cake versus pie.
        Press 5 if you prefer cake.
        Press 6 if you prefer pie.`
    );

    // what does the TwiML look like? 
    // console.log(twiml)

    return twiml.toString();
}

// ok, we're passing the digit from the /pollResponse endpoint,
// so let's use that to confirm our user's poll answer
exports.generateSuccessfulPollResponseTwiML = (digit) => {
    // let's create an object associating 
    // the digit with their cake vs pie choice
    
    const pollChoices = {
        '5': 'Cake is superior. ',
        '6': 'Pie is amazing.'
    }

    // if (digit) {
    //     const twiml = new VoiceResponse();
    //     twiml.say('Your vote has been recorded.');
    //     twiml.say(`Your choice was ${pollChoices[digit]}`);
    //     twiml.hangup();
    //     return twiml.toString();
    // }

    // give some think time
    // have volunteer talk through what's happening here

    if (digit) {
        const twiml = new VoiceResponse();

        const gather = twiml.gather({
            action: '/leaveMessage',
            numDigits: '1',
            method: 'POST',
        })

        gather.say('Your vote has been recorded.');
        gather.say(`Your choice was ${pollChoices[digit]}`)
        gather.say(`If you'd like to leave a message about why you chose your answer, press 1. Otherwise you may hang up. Thank you.`)       
               
        return twiml.toString();
    }

    // no digits gathered? let's hang up
    return generateHangupTwiML();
}

exports.generateLeaveMessageTwiML = () => {
    const twiml = new VoiceResponse();
    twiml.say(
        `'Please record your message after the beep.`
    )
    twiml.record({
        recordingStatusCallback: '/recordingStatusCallback',
        timeout: 30,
        transcribe: true,
    })

    return twiml.toString();
}

exports.generateHangupTwiml = () => {
    const twiml = new VoiceResponse();
    twiml.hangup();
    return twiml.toString()
}