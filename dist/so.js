(function(k){function x(a,c){for(var b in a)if(Object.prototype.hasOwnProperty.call(a,b)&&!1===c(a[b],b))break}function l(a,c,b){try{return a.apply(c,b||[])}catch(d){setTimeout(function(){throw d;},0)}}function y(a,c){for(var b=!0,d=0;d<a.length;d++)b=c(b,a[d],d,a)}function z(a){var c=[];x(a,function(a){c.push(a)});return c}function q(a,c){this.s=a;this.uid=c}function r(a,c,b){var d;return(d=a.q||b&&(a.q={}))&&(d[c]||b&&(d[c]={}))}function m(){}function s(a,c){function b(){}b.prototype=c.prototype;
a.prototype=new b}function A(a){a=(a+"").replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,"");for(var c,b=[];c=B.exec(a);)c[1]&&b.push(c[1]);return b}function f(a,c){this.uri=a;this.a=c||[];this.exports=t}function n(){this.d={};this.e=[]}var t={},C=/[^?#]*\//,B=/require\(['"]([^'"]+)['"]\)/g,p=new Function,h=document,u=function(){var a;a=h.getElementsByTagName("script");return(a=a[a.length-1].getAttribute("src").match(C))?a[0]:"./"}(),v=h.head||h.getElementsByTagName("head")[0],w=0,e=q.prototype;
e.r=function(){delete this.s[this.uid]};e=m.prototype;e.t=function(a,c){var b=r(this,a,!0),d=++w;b[d]=c;return new q(b,d)};e.m=function(a,c){var b=this.t(a,function(){return c.apply(this,arguments),b.r()})};e.o=function(a,c){var b=this;y(z(r(this,a,!1)),function(a,e){return l(e,b,[c])})};s(f,m);e=f.prototype;e.k=function(a,c){this.g=a;this.a=c.concat(A(a));this.o("define",this)};e.l=function(){var a=this.g;(a="function"==typeof a?l(a,this,[require,this.exports={},this]):a)&&(this.exports=a);this.j=
!1;this.o("load",this)};s(n,m);e=n.prototype;e.b=function(a,c){return a instanceof f?this.d[a.uri]=a:this.d[a]||(this.d[a]=new f(a,c))};e.c=function(a,c){a=this.b(a);var b=this;a.m("load",c);a.j||(a.j=!0,this.i(a,function(){var d=a.a,c=a.a.length;if(c)for(var e=0;e<d.length;e++)b.c(d[e],function(){!--c&&a.l()});else a.l()}))};e.i=function(a,c){var b=this.b(a);b.m("define",c);if(this.p)this.e.push(a);else if(this.p=!0,this.f=b,/__sync__/.test(b.uri)||b.n)this.h();else{var d=h.createElement("script"),
e=function(){d.onload=d.onerror=d.onreadystatechange=null;v.removeChild(d);d=null};"onload"in d?(d.onload=e,d.onerror=function(){e()}):d.onreadystatechange=function(){/loaded|complete/.test(d.readyState)&&e()};b=u+b.uri;!/.js$/i.test(b)&&(b+=".js");d.src=b;d.charset="utf-8";v.appendChild(d)}};e.h=function(a,c,b){var d=this.f;b=b||[];delete this.f;d?(d.k(a||d.g,d.n?b:d.a),this.u()):(d=this.b(c),d.n=!0,d.k(a,b),this.c(d,p))};e.u=function(){this.p=!1;if(this.e.length){var a=this.e.shift();this.i(a,p)}};
var g=new n;(k.sojs={}).config=function(a){u=a.base};k.define=function(a,c,b){var d=arguments.length;1==d?b=a:2==d&&(b=c,a instanceof Array?c=a:c=null);g.h(b,a,c)};k.require=function(a,c){var b;a instanceof Array&&(b=a,a="__sync__"+ ++w);b=g.b(a,b);if(c)g.c(b,function(a){for(var b=[],e=0,f=a.a.length;e<f;e++)b.push(g.d[a.a[e]].exports);b.push(a.exports);l(c,a,b)});else{if(b.exports!==t)return b.exports;g.c(b,p)}}})(this);
