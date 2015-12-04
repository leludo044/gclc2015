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
 - Gestion de l'encodage : fonctionnel : désactivé
*/


var PORT = 5140;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var fs = require('fs');

var fileName = "/opt/gclc/gclc.log";

var uncomp = require('./uncompress');

// Pour la gestion des caractères spéciaux  
//var enc = require('./encodechar');

var client = dgram.createSocket('udp4');
client.on('message', function(msg, rinfo) {
  uncomp(msg,function(err,msgUnzip){
    convertDate(msgUnzip.toString(),
      writeMessage);
  });
  //Avec gestion de l'encodage :
  /*
  convertDate(msg.toString(),
      writeMessage);
  */
});
client.bind(PORT) ;

//Fonction de réception des messages :
function convertDate(msg, callback){

  // détection du séparateur t0 du raspberry
  var index = msg.indexOf(':');
  var initialTimestamp = parseInt(msg.substring(0,index))*1000;
  var initialDate = formatDay(new Date(initialTimestamp));
  var data = msg.slice(index+1);

  var messages = data.split('$$');
  var nbMessages = messages.length;

  var dataToWrite = '';

  for (var i=0;i<nbMessages;i++)
  {
      var message = messages[i];

      //détection du séparateur timestamp/message
      var indexTS = message.indexOf('£');

      if (indexTS == -1){
          //Gestion des message contenant le séparateur
          dataToWrite += message;

          // Traitement des caractères spéciaux
          //dataToWrite += enc(message)+'\n';
      } else {
        //Gestion du début du message avant retour chariot (ou sans retour chariot)
        
        //Reconstitution du timestamp
        var timestamp = buildTimestamp(message,indexTS,initialTimestamp);
        var bodyMsg = message.substring(indexTS+1,message.length);
        dataToWrite += initialDate + timestamp +' '+bodyMsg;
        
        // Pour la gestion des caractères spéciaux  
        // dataToWrite += initialDate + timestamp +' '+enc(bodyMsg)+'\n';
      }
  }
  //Suppression du dernier saut de ligne.
  // Pour la gestion des caractères spéciaux  
  //dataToWrite = dataToWrite.slice(0, -1);

  callback(dataToWrite);
}

//Construction de l'horodatage (hh:mm:ss)
function buildTimestamp(message,index, initialTimestamp){
    var diffTimeStamp = parseInt(message.substring(0,index))*1000;
    return new Date(initialTimestamp + diffTimeStamp).toLocaleTimeString();
}

//Fonction d'écriture des messages dans le fichier :
//Le fichier est remplacé.
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
  return dateTab[1]+' '+dateTab[2].replace(regExp, " ") + ' ';
};
