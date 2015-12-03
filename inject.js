var PORT = 5140;
var HOST = '127.0.0.1';

var dgram = require('dgram');

var sender = dgram.createSocket('udp4');

var send = function (message) {
var sender = dgram.createSocket('udp4');
    sender.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err) {
            console.log('Error !');
            throw err;
        }
        console.log('UDP message sent to ' + HOST + ':' + PORT+' : '+message.toString());
sender.close();
    });
};

var sendMessage = function(msg) {
        var messageTime = Math.floor(new Date() / 1000) - initialTime;
        var timestamped = messageTime + ':'+msg.toString() ;
        send(new Buffer(timestamped));
};

//Mémorisation d'un timestamp de référence, pour n'envoyer que le delta lors de la transmission des messages :
var initialTime = Math.floor(new Date() / 1000);
send(new Buffer(initialTime.toString()));
sendMessage(new Buffer('CodePostal is Good!'));
sendMessage(new Buffer('injection stop'));
