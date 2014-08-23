define(function(require, exports, module) {
  console.log('main mods');
  require('http://sv.so.com/p.js');
  require('http://sv.so.com/l.js');
  var img = require("http://p2.qhimg.com/t01dd5e839f1597aae2.png", function(arg) {
    console.log(arg);
    //document.body.appendChild(arg);
  });
  var img = require("http://p2.qhimg.com/t01dd5e839f1597aae2.png");
  document.body.appendChild(img);

  require('lib/underscore');
  console.log(_);
  var Computer = require('./computer');
  console.log(Computer);
  var obj = require('mods/obj');
  console.log(obj)

  var Printer = require('mods/printer');
  var printer = new Printer;
  printer.echo('this is printer')

  var str = require('mods/str');
  console.log(str)

  require('mods/util',function(a){
      console.log(a.multify(3,5))
  });

  var util = require('mods/util');
    console.log(util.multify(6,3))

  var computer = new Computer;

  var sum = computer.add(5, 4);
  printer.echo(sum)

 

  require(['mods/str', 'mods/printer'], function(a, b) {
    console.log(a);
    console.log(b);
  });

  /*  var Person = require('mods/person');
      var p = new Person;
      p.output('I am person object');*/


  var Person = require('mods/point');


  var util = require('mods/sub/cla');

  /* var html = require('./tmpl.html');
      console.log(html)
        var tpl = require('mods/tmpl.tpl');
      console.log(tpl);
      var text = require('text!mods/tmpl.txt');
      console.log(text);*/


  /* require('mods/style.css',function(){
          console.log('load css style')
      });*/

  var testcss = require('mods/style.css');
     /* var teststyle = require("#testcssText{color:blue;font-size:20px;width:200px;height: 30px;  border: 1px solid red;}");*/

  return {
    name: 'main'
  }
});