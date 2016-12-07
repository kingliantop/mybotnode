var express = require('express');
var app = express();
var crypto = require('crypto');
var token = 'mytesttokendemo';           // your Token


// 如果你的URL配置成 http://your-url.com/wechat,
// 那么就修改为 app.use('/wechat', function(req, res, next){}

app.use('/', function(req, res, next){
    console.log('start weixin url validation...');

    var signature =  req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        echostr = req.query.echostr;

    var sha1 = crypto.createHash('sha1'),
        sha1Str = sha1.update([token, timestamp, nonce].sort().join('')).digest('hex');

    res.set('Content-Type', 'text/plain');

    if (sha1Str == signature) {
        res.status(200).send(echostr);
        console.log('validation success');
    } else {
        console.log('validation error');
        res.status(500).end();
    }

});

// 如果你用nginx做proxy_pass,那么请在nginx里面设置一下,
// 如果你没有用 proxy_pass, 那么可将端口修改为 80

app.listen(process.env.PORT, function(){
    console.log('Validation server start listening at system port')
});

