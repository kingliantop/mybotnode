var express   = require('express'),
    builder   = require('botbuilder'),
    connector = require('../WechatConnector');

// Create http server
var app    = express();

// Create wechat connector
var wechatConnector = new connector.WechatConnector({
    appID: "wx00f1e1d61568aa50",
    appSecret: "40936478e630cf787392be4dd81d77bc",
    appToken: "mytesttokendemo"
});

var bot = new builder.UniversalBot(wechatConnector);

// Bot dialogs
bot.dialog('/', [
    function (session) {
        if (session.userData && session.userData.name) {
            if (session.message.attachments &&
                session.message.attachments.length > 0) {
                var atm = session.message.attachments[0];
                if (atm.contentType == connector.WechatAttachmentType.Image) {
                    var msg = new builder.Message(session).attachments([atm]);
                    session.send(msg);
                }
            }
            session.send("How are you, " + session.userData.name);
        } else {
            builder.Prompts.text(session, "What's your name?");
        }
    },
    function (session, results) {
        session.userData.name = results.response;
        session.send("OK, " + session.userData.name);
        builder.Prompts.text(session, "What's your age?");
    },
    function (session, results) {
        session.userData.age = results.response;
        session.send("All right, " + results.response);
    }
]);

app.use('/bot/wechat', wechatConnector.listen());

app.get('*', function(req, res) {
    res.send(200, 'Hello Wechat Bot');
});

// Start listen on port
app.listen(process.env.PORT || 8080, function() {
    console.log('server is running.');
});