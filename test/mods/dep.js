define(function(require,exports,module){
	function dep(){
	}
	dep.prototype.output=function(a){
		console.log(a)
	}
	window.dep = dep;
})