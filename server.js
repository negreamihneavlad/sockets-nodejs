var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var credentials = require('./credentials/credentials.js');

var Particle = require('particle-api-js');
var particle = new Particle();
var token; // from result of particle.login
var rotate = 0;

particle.login({username: credentials.email, password: credentials.password}).then(
    function (data) {
        console.log('API call completed on promise resolve: ', data.body.access_token);
        token = data.body.access_token;
        c_func(d_uid, token);

    },
    function (err) {
        console.log('API call completed on promise fail: ', err);
    }
);
// var devicesPr = particle.listDevices({ auth: token });
// devicesPr.then(
//     function(devices){
//         console.log('Devices: ', devices);
//         var fnPr = particle.callFunction({ deviceId: '1c0022001547353136383631', name: 'fun', argument: 'D1:HIGH', auth: token });
//
//         fnPr.then(
//             function(data) {
//                 console.log('Function called succesfully:', data);
//             }, function(err) {
//                 console.log('An error occurred:', err);
//             });
//     },
//     function(err) {
//         console.log('List devices call failed: ', err);
//     }
// );

var d_uid = '1c0022001547353136383631';
var timer1;
console.log("---------------------------------------------------",rotate);



// timer1 = setInterval(talk_with_photon, 5000);
//
// function talk_with_photon() {
//     //g_var(d_uid, token);
//
// }
function g_var(d_id, l_token) {
    particle.getVariable({deviceId: d_id, name: 'getpos', auth: l_token}).then(
        function (data) {
            console.log('Device variable retrieved successfully:', data.body.result);
        }, function (err) {
            console.log('An error occurred while getting attrs:', err);
        });
}

function c_func(d_id, l_token) {

    var fnPr = particle.callFunction({deviceId: d_id, name: 'setpos', argument: 50, auth: l_token});

    fnPr.then(
        function (data) {
            console.log('Function called succesfully WiFi_RSSI: ', data);
        }, function (err) {
            console.log('An error occurred:', err);
        });
}
//
// var deviceID    = "1c0022001547353136383631";
// var accessToken = token;
// var setFunc = "setpos";
// var getFunc = "getpos";
//
//
// function setValue(obj) {
//     //var newValue = document.getElementById('degBoxId').value;
//     sparkSetPos(rotate);
// }
//
// function fineAdjust(value) {
//     var currentValue = parseInt(document.getElementById('curPos').innerHTML);
//     var setValue = value + currentValue;
//     sparkSetPos(setValue);
//     document.getElementById("degBoxId").value = setValue;
// }
//
// function sparkSetPos(newValue) {
//     var requestURL = "https://api.spark.io/v1/devices/" +deviceID + "/" + setFunc + "/";
//     $.post( requestURL, { params: newValue, access_token: accessToken });
// }


app.use(require('express').static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/mobile', function (req, res) {
    res.sendFile(__dirname + '/mobile.html');
});

io.on('connection', function (socket) {
    socket.on('change', function (data) {
        rotate = data.gamma;
        io.emit('changeData', data);
    });
});

http.listen(2000, function () {
    console.log('listening on *:2000');
});