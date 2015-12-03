var PORT = 5140;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var os = require('os');
var fs = require('fs');

var fileName = "/opt/gclc/gclc.log";
  

var client = dgram.createSocket('udp4');
client.on('message', function(msg, rinfo) {
  console.log('Received %d bytes from %s:%d\n',
              msg.length, rinfo.address, rinfo.port, msg.toString());
              convertDate(msg.toString(),writeMessage);
  
});
client.bind(PORT) ;

function convertDate(msg, callback){
  var tab = msg.split(':');
  //console.log(tab)
  var message = formatDay()+" "+new Date(parseInt(tab[0])*1000).toLocaleTimeString()+' '+tab[1];
  //console.log(message);
  callback(message);
}

function writeMessage(msg){
  fs.appendFile(fileName, msg.toString(), function(err) {
      if(err) {
          return console.log(err);
      }
  
      console.log("The file was saved!",fileName);
  }); 
  
}

var formatDay = function () {

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = new Date();
    var day = d.getDate();

    var formatedDay = months[d.getMonth()] + " ";
    if (day < 10) {
        formatedDay += " " + d.getDate();
    } else {
        formatedDay += d.getDate();
    }
    return formatedDay ;
};
