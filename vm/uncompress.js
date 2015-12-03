module.exports = (function() {
    var zlib = require('zlib');
    var uncompress = function (dataZip, callback){
        return zlib.gunzip(dataZip,function(err, data){
            console.log("gunzip.return",data,err) 
            if(err)throw err;
            callback(err, data);
        });
    }
    return uncompress;
}());