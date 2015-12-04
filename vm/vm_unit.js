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
 - Ecriture en masse des messages dans le fichier
 - Décompression des messages reçus

*/


var PORT = 5140;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var fs = require('fs');

var fileName = "/opt/gclc/gclc.log";


var enc = require('./encodechar');

var initialTimestamp;
var initialDate;
var data;
console.log('ok')
var client = dgram.createSocket('udp4');
console.log('x')
client.on('message', function (message, rinfo) {
  var msg = message.toString();
  console.log('msg',msg);
  if(initialDate) { 
      if (msg == '£££'){
        writeMessage(data);
      }else{
        convertDate(msg);
      }
  }else{
        initialTimestamp = parseInt(msg)*1000;
        initialDate = formatDay(new Date(initialTimestamp));
  }
});
client.bind(PORT) ;

//Fonction de réception des messages :
function convertDate(msg){
  var indexTS = data.indexOf('£');
  var timestamp = buildTimestamp(msg,indexTS,initialTimestamp);
  var bodyMsg = message.substring(indexTS+1,message.length);
  data += initialDate + timestamp +' '+ enc(bodyMsg) + '\n';
}

//Construction de l'horodatage (hh:mm:ss)
function buildTimestamp(message,index, initialTimestamp){
    var diffTimeStamp = parseInt(message.substring(0,index))*1000;
    return new Date(initialTimestamp + diffTimeStamp).toLocaleTimeString();
}

//Fonction d'écriture des messages dans le fichier :
function writeMessage(msg){
  fs.writeFile(fileName, msg.toString(), function(err) {
      if(err) {
          return console.log(err);
      }
  
  }); 
}

//Fonction permettant de calculer la date à afficher :
var formatDay = function (date) {
  var regExp = /^0/;
  var stringDate= new String(date);
  var dateTab=stringDate.split(" ");
  //console.log('dateTab',dateTab);
  return dateTab[1]+' '+dateTab[2].replace(regExp, " ") + ' ';
};


