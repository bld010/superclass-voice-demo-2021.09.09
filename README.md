
This repo has several branches so you can see each step in creating the demo. 

1. Outgoing call - first, we'll complete an outgoing call. I will live code from the `outgoing-call` branch, and the completed code is in the `outgoing-call-complete` branch. 
2. Welcome - We'll set up a `/welcome` endpoint in an express.js web server. This is where Twilio will send a webhook to request TwiML instructions whenever our Twilio number receives an incoming call. I will live code from the `welcome` branch, and the completed code is in the `welcome-complete` branch. 
3. Poll Response - We used a `<Gather>` verb in the instructions returned by our `/welcome` endpoint. Twilio needs instructions on where to send that information. I will live code from the `pollResponse` branch, and the completed code is in the `pollResponse-completed` branch. 
4. Leave a Message - We will use a `<Record>` TwiML instruction to allow a caller to leave a message. I will live code from the `leaveMessage` branch, and the completed code is in the `leaveMessage-complete` branch. 
5. Final product - To see the completed application, check out the `final` branch. It also has comments explaining each step, as well as some useful `console.log()`s so you can see what TwiML Twilio is sending and receiving. 

Each `complete` branch has a README with instructions for how you can try out each step. 

