var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var https = require('https');


var array = [];
var isOpen = false;
var count = 1;
var secret = new Buffer('', 'base64');
//토큰 생성
function getToken(channelId) {
    let payload = {
        exp: Math.floor(Date.now()/1000) + (60 * 60),
        role: "external",
        channel_id: channelId + "",
        pubsub_perms: {
            listen: ["broadcast"],
            send: ["*"]
        }
    }
    return jwt.sign(payload, secret);
}
router.get('/fcfs', function (req, res, next) {

    let channelId = 133083079;
    if (isOpen) {
        try {
            let token = req.header('x-extension-jwt');
            if (!array.includes(token)) {
                array.push(token);
                console.log(array);
                if (array.length == count) {
                    isOpen = false;
                    let fcfsArray = JSON.stringify(array.slice(0,count));
                    console.log('send to twitchPubSub');
                    let post_data = JSON.stringify({
                        content_type : 'application/json',
                        message : '{\"code\" : \"success\", \"result\" : ' + fcfsArray + '}',
                        targets : ['broadcast']
                    });
                    let token = getToken(channelId);
                    console.log(post_data);
                    console.log(token);
                    let post_req = https.request({
                        hostname: 'api.twitch.tv',
                        port: 443,
                        path: '/extensions/message/' + channelId,
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Client-Id': 'vzy0hasx7tj8gieonbnpbapr8wfvhb',
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(post_data)
                        },
                    }, (response) => {
                        console.log('statusCode', response.statusCode);
                        response.on('data', (d) =>{
                            process.stdout.write(d);
                        });
                        
                    });
                    post_req.write(post_data);
                    post_req.end();
                }
            }
        } catch (err) {
            console.log(err);
        }
        res.json({
            data: 'added in array'
        });
    } else {
        res.json({
            data: 'closed array'
        });
    }
});
router.post('/fcfs/config', function (req, res, next) {
    //let token = req.header('x-extension-jwt');
    //let decoded = jwt.decode(token);
    //if (decoded.role === 'broadcaster') {
    if (req.body.isOpen) {
        array = [];
        count = req.body.count;
        isOpen = req.body.isOpen;
        console.log('array opened');
    } else {
        isOpen = req.body.isOpen;
        console.log('array closed');
    }
    //}
    res.json({
        data: 'config is completed'
    })
});
router.get('/fcfs/result', function (req, res, next) {
    res.json({
        data: array.slice(0, count)
    });
});
module.exports = router;