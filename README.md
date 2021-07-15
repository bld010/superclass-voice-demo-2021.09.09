# About

This is a quick Programmable Voice demo using Node, Express.js, and the Twilio Node Helper library.

# Requirements

If you'd like to try out this repo on your own, there are some prerequisites:

1. [Nodejs](https://nodejs.org/) version 14.0 or higher.
1. [Purchase a Twilio Phone Number](https://www.twilio.com/console/phone-numbers/incoming)
1. [Download ngrok](https://ngrok.com/download) in order to expose your local development server to the internet. 
1. [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
1. [nodemon](https://www.npmjs.com/package/nodemon?activeTab=readme)

# Set Up

1. Clone this repo using the following command in your terminal: `git clone https://github.com/bld010/superclass-voice-demo-2021.07.15.git`
1. In your terminal, change into the repo's directory using the following command: `cd superclass-voice-demo-20201.07.05`
1. Run `npm install` to install the dependencies
1. Run `nodemon server.js` to run your server locally.
1. In a new terminal window, run `http ngrok 3000`. Take note of the `https` url shown. 
1. Go to the [Twilio Console > Active Numbers](https://www.twilio.com/console/phone-numbers/incoming), click on your phone number, and scroll down to `Voice & Fax`.
1. Scroll down to `A CALL COMES IN` and select `Webhook`, enter your ngrok https url with `/welcome` on the end (example: `https://12345.ngrok.io/welcome`), and select HTTP POST. 
1. Click save.

You should now be able to dial your Twilio Number and hear the poll, be able to respond to the poll, and leave a voice recording. 
