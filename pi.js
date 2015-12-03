/*

Green Code Lab Challenge : Team 78 : La Poste #CodePostal

Code dédié au raspberry.

Fonctionnalités :
 - Ecoute UDP sur le port 514 
 - Initialisation : Envoi d'un timestamp de référence
 - Réception des messages
 - Ajout du timestamp avant le message : On ajoute uniquement le delta avec le timestamp de référence
 - Envoi des messages au serveur, sur le port UDP 5140

Optimisations :
 - Gestion du timestamp pour alléger les données transmises
 - [TODO] Envoi en masse des messages
 - [TODO] Compression des messages reçus

*/

var PORT = 514;
var HOST = '0.0.0.0';

var PORT_SERVER = 5140;
var HOST_SERVER = '51.255.62.78';

var dgram = require('dgram');

//Fonction permettant d'envoyer les messages au serveur :
var send = function (message) {
    var sender = dgram.createSocket('udp4');
    sender.send(message, 0, message.length, PORT_SERVER, HOST_SERVER, function (err, bytes) {
        if (err) throw err;
        //console.log('UDP message sent to ' + HOST_SERVER + ':' + PORT_SERVER);
        sender.close();
    });
};

//Mémorisation d'un timestamp de référence, pour n'envoyer que le delta lors de la transmission des messages :
var initialTime = Math.floor(new Date() / 1000);

//Envoi du timestamp de référence :
send(new Buffer(initialTime.toString()));
console.log('Service launched - initial timestamp : ' + initialTime);


var client = dgram.createSocket('udp4');
client.on('message', function (msg, rinfo) {
    //console.log('Received %d bytes from %s:%d\n', msg.length, rinfo.address, rinfo.port, msg.toString());
    
    //Mise en forme des messages (ajout du timestamp)
    var messageTime = Math.floor(new Date() / 1000) - initialTime;
    var timestamped = messageTime + ':'+msg.toString() ;
    send(new Buffer(timestamped));
});

client.bind(PORT);