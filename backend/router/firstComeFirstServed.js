var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var https = require('https');
var channelItem = require('../models/channelItem');

var array = [];
//var isOpen = false;
//var count = 1;
var secret = new Buffer('MBYztudN9N8Ga/iWMiLICKGsPDfWtPyiZ22xhXmPblE=', 'base64');

router.get('/fcfs', function (req, res, next) {

    let UserId = req.header('User-Id');
    let channelId = req.header('Channel-Id')+'';
    let item = findChannel(channelId);
    console.log(UserId + ' ' + channelId);

    if(item && item.getOpenFlag()){
        if(!item.list.includes(UserId)){
            item.list.push(UserId);
            console.log(item);
            if(item.isFull()){
                console.log('send to pubsub');
                item.setOpenFlag(false);
                let fcfsList = JSON.stringify(item.getFcfsList());
                sendListToPubSub(channelId, fcfsList);
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

    if(item){
        if(openFlag){
            item.initList();
            item.setCount(count);
            item.setOpenFlag(openFlag);
            console.log('array opened');
        }
        else{
            item.setOpenFlag(openFlag);
            console.log('array closed');
        }
    }
    else{
        array.push(new channelItem(channelId, openFlag, count));
    }
    console.log(array);
    res.json({data : 'config is completed'});
    //let token = req.header('x-extension-jwt');
    //let decoded = jwt.decode(token);
    //if (decoded.role === 'broadcaster') {
        /*
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
    })*/
});
router.get('/fcfs/result', function (req, res, next) {
    res.json({
        data: array.slice(0, count)
    });
});

function findChannel(channelId){
    for(let item of array){
        if(item['channelId'] === channelId){
            return item;
        }
    }
    return null;
}

function sendListToPubSub(channelId, fcfsList){
    let post_data = JSON.stringify({
        content_type : 'application/json',
        message : '{\"code\" : \"success\", \"result\" : ' + fcfsList + '}',
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