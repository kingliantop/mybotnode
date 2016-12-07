// PASSWORD:gy0F5X0SgjdP7ULMX7yXym9
// APPID:ff592d64-ee7c-4197-b5d8-8aeacb9c344f
var restify = require('restify');
var builder = require('botbuilder');

//get the APPID and password via environment variables

var server = restify.createServer();
server.listen(process.env.PORT || 3000, function() 
{
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot using the system environment
var connector = new builder.ChatConnector
({ appId: process.env.MY_APP_ID, appPassword: process.env.MY_APP_PASSWORD }); 

//create a text bot
var bot = new builder.TextBot(connector);
bot.add('/', function (session) {
    if (!session.userData.name) {
        session.beginDialog('/profile');
    } else {
        session.send('Hello %s!', session.userData.name);
    }
});
bot.add('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

// var bot = new builder.UniversalBot(connector);
// server.post('/api/messages', connector.listen());

// // Create bot dialogs
// bot.dialog('/', function (session) {
//     session.send("You send message: "+session.userData.name);
// });

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));

