//instantiate routes
var express = require('express');
var router = express.Router();

var RIR = require('modbus-stack').FUNCTION_CODES.READ_INPUT_REGISTERS;
var WMR = require('modbus-stack').FUNCTION_CODES.WRITE_MULTIPLE_REGISTERS;

router.route('/readInputs')
    .get(function (req, res) {
    var client = require('modbus-stack/client').createClient(502, req.query.ip);
    var mReq = client.request(RIR, 15, 1,req.query.devNum);
    mReq.on('response', function(registers) {
        client.end();
        var result = resToBin(registers[0]);
        var data = setBits(result);
        res.json(data);
    });
});

router.route('/setOutputs')
    .get(function (req, res) {
    var client = require('modbus-stack/client').createClient(502, req.query.ip);
    var mReq = client.request(WMR, 17, 1,req.query.devNum ,req.query.data);
    mReq.on('response', function (registers) {
        client.end();
            res.end(req.query.data);
        });
    });



function resToBin(res) {
    var str = "" + res.toString(2);
    var pad = "0000";
    var result = pad.substring(0, pad.length - str.length) + str;
    return result;
};

function setBits(data) {
    var in4 = (data[0] === "1" ? "1" : "0");
    var in3 = (data[1] === "1" ? "1" : "0");
    var in2 = (data[2] === "1" ? "1" : "0");
    var in1 = (data[3] === "1" ? "1" : "0");
    var inputs = { in4: in4, in3: in3, in2: in2, in1: in1 };
    return inputs;
};



module.exports = router;


