const VoiceResponse = require('twilio').twiml.VoiceResponse;


exports.welcome = () => {
    const twiml = new VoiceResponse();

    const gather = twiml.gather({
        action: '/pollResponse',
        numDigits: '1', 
        method: 'POST',
    })

    gather.say(
        `Thank you for calling the Superclass Poll.
        Today's poll is about an age-old debate at Twilio: cake versus pie.
        Press 5 if you prefer cake.
        Press 6 if you prefer pie.`
    )

    return twiml.toString();
}

exports.pollResponse = (digit) => {
    const pollChoices = {
        '5': 'Cats rule. ',
        '6': 'Dogs are awesome.'
    }
    console.log('digit in pollResponse: ', digit)

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
        
        twiml.say('We didn\'t receive any input. Goodbye!');
       
        
        return twiml.toString();
    }

    return redirectWelcome();
}

exports.leaveMessage = () => {
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

const redirectWelcome = () => {
    const twiml = new VoiceResponse();

    twiml.say('Returning to the main menu.');

    twiml.redirect('/welcome');

    return twiml.toString();
}