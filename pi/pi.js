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
 - Envoi en masse des messages
 - Compression des messages reçus

*/

// Ecouteur
var PORT = 514;
var HOST = '0.0.0.0';

// Emetteur
var PORT_SERVER = 5140;
var HOST_SERVER = '51.255.62.78';
var DELAY = 250000;

var dgram = require('dgram');
var comp = require('./compress');

//Fonction permettant d'envoyer les messages au serveur :
var send = function (message) {
    // Creation du socket UDP
    var sender = dgram.createSocket('udp4');
    sender.send(message, 0, message.length, PORT_SERVER, HOST_SERVER, function (err, bytes) {
        if (err) throw err;
        //console.log('UDP message sent to ' + HOST_SERVER + ':' + PORT_SERVER);
        sender.close();
    });
};

//Mémorisation d'un timestamp de référence, pour n'envoyer que le delta lors de la transmission des messages :
var initialTime = 0;
var dataToSend = '';

// Creation ecouteur
var client = dgram.createSocket('udp4');
client.on('message', function (msg, rinfo) {
    //console.log('Received (original) : ', msg);
    //console.log('Received (toString) : ', msg.toString());

    //initialisation d'un t0 (initialTime)
    if (dataToSend === ''){
        // Cas du premier message du cycle
        //Délai de 4min10s pour envoyer les données concaténées et compressées.
        //console.log('DELAY:',DELAY);
        //setTimeout(sendDatas, DELAY);
        setTimeout(compressedAndSendDatas, DELAY);
        //console.log('First message received');
        initialTime = Math.floor(new Date() / 1000);
        dataToSend = initialTime.toString() + ':';
    }

    //Mise en forme des messages (ajout du timestamp)
    var messageTime = Math.floor(new Date() / 1000) - initialTime;
    var msgTimestamped = messageTime + '£'+msg.toString();

    //msgTimestamped = msgTimestamped.slice(0, -1);

    dataToSend += msgTimestamped + '$$';
    //console.log('Message received : ' + msgTimestamped);
});

client.bind(PORT);


//permet la compression et l'envoi des données
function compressedAndSendDatas(){

        //console.log('Sending to server : ' + dataToSend);
        var buff =new Buffer(dataToSend);
        dataToSend = '';
        //Compression des données
        comp(buff,function(err, zipBuffer){
            if(err)throw err;
            //Envoi des données :
            send(zipBuffer);
            //console.log('Sent !');
        });
    }

//permet d'envoyer les données non compressées
function sendDatas(){
        //console.log('Sending to server : ' + dataToSend);
        var buffer = new Buffer(dataToSend);
        dataToSend = '';
        send(buffer);
        //console.log('Sent !');
    }
