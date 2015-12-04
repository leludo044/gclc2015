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
var os = require('os');
var fs = require('fs');

var fileName = "/opt/gclc/gclc.log";

//var uncomp = require('./uncompress');

var enc = require('./encodechar');

var client = dgram.createSocket('udp4');
client.on('message', function(msg, rinfo) {
  //console.log('Received %d bytes from %s:%d\n', msg.length, rinfo.address, rinfo.port, msg.toString());
  /*
  uncomp(msg,function(err,msgUnzip){
    convertDate(msgUnzip.toString(),
      writeMessage);
  });
*/
  convertDate(msg.toString(),
      writeMessage);
});
client.bind(PORT) ;

//Fonction de réception des messages :
function convertDate(msg, callback){

  //console.log('Reception');

  // détection du séparateur t0 du raspberry
  var index = msg.indexOf(':');
  //console.log('msg',msg);
  var initialTimestamp = parseInt(msg.substring(0,index))*1000;
  //console.log('initialTimestamp',initialTimestamp);
  var initialDate = formatDay(new Date(initialTimestamp));

  // console.log('msgTimeStamp', msgTimeStamp);
  var data = msg.substring(index+1,msg.length);

  var messages = data.split('$$');
  var nbMessages = messages.length;

  var dataToWrite = '';

  //console.log('Transformation des donnees');

  for (var i=0;i<nbMessages;i++)
  {
      var message = messages[i];
      //détection du séparateur timestamp/message
      var indexTS = message.indexOf('£');
      //console.log('index £',indexTS);
      if (indexTS == -1){
          //Gestion des message avec retour chariot
          dataToWrite += enc(message)+'\n';
      } else {
        //Gestion du début du message avant retour chariot (ou sans retour chariot)
        //TODO caractères spéciaux
        
        //Reconstitution du timestamp
        var timestamp = buildTimestamp(message,indexTS,initialTimestamp);
        var bodyMsg = message.substring(indexTS+1,message.length);
        dataToWrite += initialDate + timestamp +' '+enc(bodyMsg)+'\n';
        //console.log('dataToWrite',dataToWrite.length)
      }
  }

  dataToWrite = dataToWrite.slice(0, -1);

  //console.log('Donnees transformees : ' + dataToWrite);

  callback(dataToWrite);
}

//Construction de l'horodatage (hh:mm:ss)
function buildTimestamp(message,index, initialTimestamp){
    var diffTimeStamp = parseInt(message.substring(0,index))*1000;
    //console.log('diffTimeStamp', diffTimeStamp);
    return new Date(initialTimestamp + diffTimeStamp).toLocaleTimeString();
}
//Fonction d'écriture des messages dans le fichier :
function writeMessage(msg){
  fs.writeFile(fileName, msg.toString(), function(err) {
      if(err) {
          return console.log(err);
      }
  
      //console.log("The file was saved!",fileName);
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
