var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    _static = require('node-static'),
    fileServer = new _static.Server('./www/');

app.listen(8080);

function handler(request, response) {
    request.addListener('end', function() {
        fileServer.serve(request, response);
    });
}

io.sockets.on('connection', function(client) {
    console.log("connected: " + client);
    client.on('completeHand', function(data){
        console.log('completeHand: ', data);
        client.broadcast.emit('completeHand', data);
    });
});
io.sockets.on('model updated', function (data) {
    io.sockets.emit('model updated', data);
});
