/*

Green Code Lab Challenge : Team 78 : La Poste #CodePostal

Code dédié au serveur.

Fonctionnalités :
 - Ecoute UDP sur le port 5140 
 - Initialisation : Réception d'un timestamp de référence
 - Réception des messages précédés du nombre de secondes depuis le timestamp de référence
 - Mise en forme de la date et des messages
 - Ecriture des messages dans le fichier /opt/gclc/gclc.log

Optimisations :
 - Gestion du timestamp pour alléger les données transmises
 - [TODO] Ecriture en masse des messages dans le fichier
 - [TODO] Décompression des messages reçus

*/


var PORT = 5140;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var os = require('os');
var fs = require('fs');

var fileName = "/opt/gclc/gclc.log";

var initialTimestamp = null;  
var initialDate = "";

var messages = "";
var client = dgram.createSocket('udp4');
client.on('message', function (msg, rinfo) {
    //console.log('Received %d bytes from %s:%d\n', msg.length, rinfo.address, rinfo.port, msg.toString());

    convertDate(msg.toString(), bufferMessage);

});
client.bind(PORT) ;

//Fonction de réception des messages :
function convertDate(msg, callback){

  if (msg.indexOf(':') == -1)
  {
    initialTimestamp = parseInt(msg) * 1000;
    // console.log('initialTimestamp',initialTimestamp);
    initialDate = formatDay(new Date(initialTimestamp));

    convertDate = function(msg, callback) {
      var index = msg.indexOf(':');
      var msgTimeStamp = parseInt(msg.substring(0,index))*1000;
      // console.log('msgTimeStamp', msgTimeStamp);
      var bodyMsg = msg.substring(index+1,msg.length);
      var message = initialDate + new Date(initialTimestamp + msgTimeStamp).toLocaleTimeString()+' '+bodyMsg;
      //console.log(message);
      callback(message);
    }
  }
}

//Fonction d'écriture des messages dans le fichier :
function writeMessage(msg){
  fs.appendFile(fileName, msg.toString(), function(err) {
      if(err) {
          return console.log(err);
      }
  
      // console.log("The file was saved!",fileName);
  }); 
}

//Fonction permettant de calculer la date à afficher :
var formatDay = function (date) {
  var regExp = /^0/;
  var stringDate= new String(date);
  var dateTab=stringDate.split(" ");
  return dateTab[1]+' '+dateTab[2].replace(regExp, " ") + ' ';
};

// Remplissage du buffer et écriture sur disque en fin d'envoi
var bufferMessage = function (msg) {
    messages += (msg+"\n");
    if (msg.lastIndexOf('injection stop') > -1) {
        fs.appendFile(fileName, messages.toString(), function (err) {
            if (err) throw err

            // console.log("The file was saved!",fileName);
        });
    }
};