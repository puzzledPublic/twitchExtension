var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var array = [];
var isOpen = false;
var count = 1;
//wmJpLUv1gAzYh8O2VV+u0OPCRoL/Rf9wCSPoxtIoOD8=
router.get('/fcfs', function (req, res, next) {
    if (isOpen) {
        try {
            let token = req.header('x-extension-jwt');
            if(!array.includes(token)){
                array.push(token);
                console.log(array);
                if (array.length == count) {
                    isOpen = false;
                }
            }
        } catch (err) {
            console.log(err);
        }
        res.json({
            data: 'added in array'
        });
    }
    else{
        res.json({
            data: 'fcfs is closed'
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
        } else {
            isOpen = req.body.isOpen;
        }
    //}
    res.json({
        data: 'config is completed'
    })
});
router.get('/fcfs/result', function(req, res, next){
    res.json({data: array.slice(0, count)});
});
module.exports = router;