module.exports = (function() {
var encodechar = function(text){
    var res='';
    for (var index = 0; index < text.length; index++) {
        var code = text[index].charCodeAt(0);
        if(code<=32){
			var x = (code).toString(8);
			//console.log(code,x)
			if(x<10){
				res += '#00'+x;
			}else if(x<100){
				res += '#0'+x;
			}else{
    	        res += '#'+x;
			}
        }else{
            res += text[index]
        }
    }
    return res;
}
return encodechar;
}());