module.exports = (function() {
    var zlib = require('zlib');
    var compress = function (data, callback){
        return zlib.gzip(data,function(err, data){
            console.log("ok",data) 
            callback(err, data);
        });
    }
    return compress;
}());