const functions = require("firebase-functions");

exports.justCallWebhook = functions.https.onRequest((req, res) => {
    console.log("JustCall Webhook Event:", req.body);

    // Respond to JustCall
    res.status(200).send("Webhook received");
});