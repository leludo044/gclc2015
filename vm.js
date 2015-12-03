var PORT = 5140;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var os = require('os');
var fs = require('fs');

var fileName = "/opt/gclc/gclc.log";

var initialTimestamp = null;  
var initialDate = "";

var client = dgram.createSocket('udp4');
client.on('message', function(msg, rinfo) {
  //console.log('Received %d bytes from %s:%d\n', msg.length, rinfo.address, rinfo.port, msg.toString());
  
  convertDate(msg.toString(),writeMessage);
  
});
client.bind(PORT) ;


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

function writeMessage(msg){
  fs.appendFile(fileName, msg.toString(), function(err) {
      if(err) {
          return console.log(err);
      }
  
      // console.log("The file was saved!",fileName);
  }); 
  
}

var formatDay = function (date) {

var regExp = /^0/;
var stringDate= new String(date);
var dateTab=stringDate.split(" ");
return dateTab[1]+' '+dateTab[2].replace(regExp, " ") + ' ';
/*
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var day = date.getDate();

    var formatedDay = months[date.getMonth()] + " ";
    if (day < 10) {
        formatedDay += " " + date.getDate();
    } else {
        formatedDay += date.getDate();
    }
    return formatedDay + " ";
  */
};
