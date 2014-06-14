define(function(require,exports,module){
	console.log('util.js')
	var util = {
		mul:function(a,b){
			return a*b
		},
		sub:function(a,b){
			return a - b
		}
	}
	exports.multify = util.mul; 
});