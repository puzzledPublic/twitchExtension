var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var https = require('https');
var channelItem = require('../models/channelItem');

var array = [];
var secret = new Buffer('MBYztudN9N8Ga/iWMiLICKGsPDfWtPyiZ22xhXmPblE=', 'base64');

router.get('/fcfs', function (req, res, next) {

    let UserId = req.header('User-Id');
    let channelId = req.header('Channel-Id')+'';
    let userName = req.header('User-Name');
    let item = findChannel(channelId);
    console.log(UserId + ' ' + userName + ' ' + channelId);

    if(item && item.getOpenFlag()){
        if(!item.list.includes(userName)){
            item.list.push(userName);
            console.log(item);
            if(item.isFull()){
                console.log('send to pubsub');
                item.setOpenFlag(false);
                let fcfsList = JSON.stringify(item.getFcfsList());
                sendListToPubSub(channelId, 'success', fcfsList);
            }
        }
        res.json({data : 'added in array'});
    }
    else{
        res.json({data : 'array is closed'});
    }
    
});
router.post('/fcfs/config', function (req, res, next) {

    let channelId = req.body.channelId + '';
    let openFlag = req.body.openFlag;
    let count = req.body.count;
    let item = findChannel(channelId);
    let code = 'opend';
    if(item){
        if(openFlag){
            item.initList();
            item.setCount(count);
            item.setOpenFlag(openFlag);
            //send start msg to pubsub
            sendListToPubSub(channelId, 'start');
            console.log('array opened');
        }
        else{
            item.setOpenFlag(openFlag);
            code = 'closed';
            console.log('array closed');
        }
    }
    else{
        array.push(new channelItem(channelId, openFlag, count));
        sendListToPubSub(channelId, 'start');
    }
    console.log(array);
    res.json({data : code});
    
});

function findChannel(channelId){
    for(let item of array){
        if(item['channelId'] === channelId){
            return item;
        }
    }
    return null;
}

function sendListToPubSub(channelId, code, fcfsList){
    if(!fcfsList){
        fcfsList = '\"none\"';
    }
    let post_data = JSON.stringify({
        content_type : 'application/json',
        message : '{\"code\" : \"' + code + '\", \"result\" : ' + fcfsList + '}',
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
module.exports = router;