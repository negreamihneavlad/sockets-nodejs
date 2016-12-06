var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(require('express').static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/mobile', function (req, res) {
    res.sendFile(__dirname + '/mobile.html');
});

io.on('connection', function (socket) {
    socket.on('change', function (data) {
            io.emit('changeData',data);
    });
});

http.listen(2000, function () {
    console.log('listening on *:2000');
});