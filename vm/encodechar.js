module.exports = (function() {
    var DBLZERO = '#00';
    var SIMPLEZERO = '#0';
    var SHARP = '#';
    
    var encodechar = function(text){
        var res='';
        for (var index = 0; index < text.length; index++) {
            var c = text[index];
            var code = c.charCodeAt(0);
            if(code<32){
                var x = (code).toString(8);
                //console.log(code,x)
                if(x<10){
                    res += DBLZERO+x;
                }else if(x<100){
                    res += SIMPLEZERO+x;
                }else{
                    res += SHARP+x;
                }
            }else{
                res += c;
            }
        }
        return res;
    }
    return encodechar;
}());