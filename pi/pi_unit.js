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

var PORT = 514;
var HOST = '0.0.0.0';

var PORT_SERVER = 5140;

var conf = require('./conf');

var HOST_SERVER = conf.HOST_SERVER;
var DELAY =conf.DELAY;

var dgram = require('dgram');
var comp = require('./compress');

var sender;

//initialisation du socket d'envoi
function initSender(){
    console.log('initSender')
    sender = dgram.createSocket('udp4');
}

//Fonction permettant d'envoyer les messages au serveur :
var send = function (message) {
    console.log('send',message,PORT_SERVER,HOST_SERVER);
    // var message = compress(uncompressedMessage);
    sender.send(message, 0, message.length, PORT_SERVER, HOST_SERVER, function (err, bytes) {
        console.log('err',err)
        if (err) throw err;
        //console.log('UDP message sent to ' + HOST_SERVER + ':' + PORT_SERVER);
    });
};

//fermeture de la socket d'envoi
function closeSender(){
        sender.close();
}
//Mémorisation d'un timestamp de référence, pour n'envoyer que le delta lors de la transmission des messages :
var initialTime = 0;
var dataToSend = [];

//ouverture du socket d'écoute
var client = dgram.createSocket('udp4');

console.log('DELAY:',DELAY);

//écoute des messages du socket
var first = true;
client.on('message', function (msg, rinfo) {
    console.log('Received (original) : ', msg);
    console.log('Received (toString) : ', msg.toString());
    //initialisation d'un t0 (initialTime)
    if (first){
        first=false;
        dataToSend=[];
        //Délai de 4min10s pour envoyer les données concaténées et compressées.
        setTimeout(sendDatas, DELAY);
        console.log('First message received');
        initialTime = Math.floor(new Date() / 1000);
        dataToSend.push(initialTime.toString());
    }

    //Mise en forme des messages (ajout du timestamp)
    var messageTime = Math.floor(new Date() / 1000) - initialTime;
    var msgTimestamped = messageTime + '£'+msg.toString();
    console.log('Message stock : ' + msgTimestamped);
    dataToSend.push(msgTimestamped);

});

client.bind(PORT);


//permet la compression et l'envoi des données
function compresseAndSendDatas(){
        initSender();
        var size = dataToSend.length;
        for (var index = 0; index < size; index++) {
            var msg = dataToSend[index];
            console.log('Sending to server : ' + msg);
            var buff =new Buffer(msg);
            //Compression des données
            comp(buff,function(err, zipBuffer){
                if(err)throw err;
                //Envoi des données :
                send(zipBuffer);
                console.log('Sent !');
            });
        }
        closeSender();
    }
//permet d'envoyer les données non compressées
function sendDatas(){
        console.log('sendData');
        initSender();
        first=true;
        dataToSend.push('£££');
        var size = dataToSend.length;
        console.log('size',size)
        for (var index = 0; index < size; index++) {
            var msg = dataToSend[index];
            console.log('Sending to server : ' + msg);
            var buff =new Buffer(msg);
            send(buff);
            console.log('Sent !');
        };
        closeSender();
    }

