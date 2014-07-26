define(function(require,exports,module){
    function View(){
    }
    var p = View.prototype;
    p.add = function(a,b){
        return a+b
    }
    p.say = function(msg){
        console.log(msg)
    }
    console.log('View mods')
    module.exports = View
})