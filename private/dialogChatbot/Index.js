const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');
const serviceAccount  = require('../../sandy-account.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const { SessionsClient } = require('dialogflow');


exports.dialogflowGateway = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const { queryInput, sessionId } = request.body;


        const sessionClient = new SessionsClient({ credentials: serviceAccount  });
        const session = sessionClient.sessionPath('sandy', sessionId);


        const responses = await sessionClient.detectIntent({ session, queryInput});

        const result = responses[0].queryResult;
        console.log(result);

        response.send(result);
    });
});