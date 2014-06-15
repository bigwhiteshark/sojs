define(function(require,exports,module){
	var help = {
		mul:function(a,b){
			return a*b
		},
		sub:function(a,b){
			return a - b
		}
	}
	exports.multify = help.mul; 
});