(function(k){function x(a,c){for(var b in a)if(Object.prototype.hasOwnProperty.call(a,b)&&!1===c(a[b],b))break}function l(a,c,b){try{return a.apply(c,b||[])}catch(d){setTimeout(function(){throw d;},0)}}function y(a,c){for(var b=!0,d=0;d<a.length;d++)b=c(b,a[d],d,a)}function z(a){var c=[];x(a,function(a){c.push(a)});return c}function q(a,c){this.e=a;this.uid=c}function r(a,c){var b;return b=a.e||(a.e={}),b[c]||(b[c]={})}function m(){}function s(a,c){function b(){}b.prototype=c.prototype;a.prototype=
new b}function A(a){a=(a+"").replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,"");for(var c,b=[];c=B.exec(a);)c[1]&&b.push(c[1]);return b}function g(a,c,b){this.uri=a;this.a=c||[];this.exports=t;this.i=b}function n(){this.d={};this.f=[]}var t={},C=/[^?#]*\//,B=/require\(['"]([^'"]+)['"]\)/g,p=new Function,h=document,u=function(){var a;a=h.getElementsByTagName("script");return(a=a[a.length-1].getAttribute("src").match(C))?a[0]:"./"}(),v=h.head||h.getElementsByTagName("head")[0],w=0,e=q.prototype;
e.t=function(){delete this.e[this.uid]};e=m.prototype;e.u=function(a,c){var b=r(this,a),d=++w;b[d]=c;return new q(b,d)};e.q=function(a,c){var b=this.u(a,function(){return c.apply(this,arguments),b.t()})};e.g=function(a,c){var b=this;y(z(r(this,a)),function(a,e){return l(e,b,[c])})};s(g,m);e=g.prototype;e.n=function(a,c){this.j=a;this.a=c.concat(A(a));this.g("define",this)};e.p=function(){this.i&&this.o();delete this.m;delete this.i;this.g("load",this)};e.o=function(){var a=this.j;(a="function"==typeof a?
l(a,this,[require,this.exports={},this]):a)&&(this.exports=a);this.g("exec",this);return this.exports};s(n,m);e=n.prototype;e.b=function(a,c,b){return a instanceof g?this.d[a.uri]=a:this.d[a]||(this.d[a]=new g(a,c,b))};e.c=function(a,c,b){a=this.b(a,[],b&&/__sync__/.test(b.uri));var d=this;a.q("load",c);a.m||(a.m=!0,this.l(a,function(){var b=a.a,c=a.a.length;if(c)for(var e=0;e<b.length;e++)d.c(b[e],function(){!--c&&a.p()},a);else a.p()}))};e.l=function(a,c){var b=this.b(a);b.q("define",c);if(this.s)this.f.push(a);
else if(this.s=!0,this.h=b,/__sync__/.test(b.uri)||b.r)this.k();else{var d=h.createElement("script"),e=function(){d.onload=d.onerror=d.onreadystatechange=null;v.removeChild(d);d=null};"onload"in d?(d.onload=e,d.onerror=function(){e()}):d.onreadystatechange=function(){/loaded|complete/.test(d.readyState)&&e()};b=u+b.uri;!/.js$/i.test(b)&&(b+=".js");d.src=b;d.charset="utf-8";v.appendChild(d)}};e.k=function(a,c,b){var d=this.h;b=b||[];delete this.h;d?(d.n(a||d.j,d.r?b:d.a),this.v()):(d=this.b(c),d.r=
!0,d.n(a,b),this.c(d,p))};e.v=function(){this.s=!1;if(this.f.length){var a=this.f.shift();this.l(a,p)}};var f=new n,e=k.sojs={};e.config=function(a){u=a.base};k.define=function(a,c,b){var d=arguments.length;1==d?b=a:2==d&&(b=c,a instanceof Array?c=a:c=null);f.k(b,a,c)};k.require=function(a,c,b){var d;a instanceof Array&&(d=a,a="__sync__"+ ++w);a=f.b(a,d,b);if(c)f.c(a,function(a){for(var b=[],d=0,e=a.a.length;d<e;d++)b.push(f.d[a.a[d]].exports);b.push(a.exports);l(c,a,b)});else if(b)f.c(a,p);else return a.exports!==
t?a.exports:a.o()};e.use=function(a,c){require(a,c,!0)}})(this);
