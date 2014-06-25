#  sojs
sojs,so open, so fast, so simple。so,编程就是如此简单。

## 简介
一个极简极小的符合AMD规范按需模块加载器，特点是小巧、简洁、轻量级，目的使开发者能够快速上手，无学习成本，按模块开发。

sosj是一个符合AMD规范，目的在于希望开发者能够按模块开发，像使用java、c++、python、php等语言一样，有模块的概念，可以导入模块。

## 使用
模块系统的基础路径即 base 的默认值，与 so.js 的访问路径相关：

	如果 so.js 的访问路径是：
	  http://example.com/assets/so.js

	则 base 路径为：
	  http://example.com/assets/

也可以手工配置 base 路径：

	require.config({
	  base: './'
	});


**define** (factory)

define 是一个全局函数，用来定义模块:

define 接受 factory 参数，factory 可以是一个函数，也可以是一个对象或字符串。

factory提供了3个参数：**require**, **exports**, **module**，用于模块的引用和导出。

		define(function(require,exports,module){
			function Computer(){
			}
			var p = Computer.prototype;
			p.add = function(a,b){
				return a+b
			}
			module.exports = Computer
		});

		define({ name: "bigwhiteshark" });

		define('I am sojs that a tiny javascript on-demand module loader.');

  **define** (id?,deps?,factory)

  define 也可以接受两个以上参数。字符串 id 表示模块标识，数组 deps 是模块依赖。

**require Function**

require是一个全局函数，也可以是 factory 函数的第一个参数。

**require require(id)**

require 是一个方法，接受 模块标识 作为唯一参数，用来获取其他模块提供的接口。

		//引用printer模块
		var printer = require('mods/printer');
		//调用模块 printer 的方法
		printer.echo();

		define(function(require, exports) {

		  // 获取模块 a 的接口
		  var a = require('./a');

		  // 调用模块 a 的方法
		  a.doSomething();

		});

**注意：** 在开发时，require 的书写需要遵循一些 简单约定。

**require(id, callback?)** 

 如果callback方法不为空，用来在模块内部异步加载模块，并在加载完成后执行指定回调。

		define(function(require, exports, module) {

		  // 异步加载一个模块，在加载完成时，执行回调
		  require('./b', function(b) {
		    b.doSomething();
		  });

		   // 异步加载多个模块，在加载完成时，执行回调
		  require(['./c', './d'], function(c, d) {
		    c.doSomething();
		    d.doSomething();
		  });

		});

**exports Object**

exports 是一个对象，用来向外提供模块接口。

	define(function(require, exports) {

	  // 对外提供 name 属性
	  exports.name = 'bigwhiteshark';

	  // 对外提供 doSomething 方法
	  exports.doSomething = function() {};

	});

除了给 exports 对象增加成员，还可以使用 return 直接向外提供接口。

	define(function(require) {

	  // 通过 return 直接提供接口
	  return {
	    name: 'bigwhiteshark',
	    doSomething: function() {}
	  };

	});

如果 return 语句是模块中的唯一代码，还可简化为：

	define({
	  name: 'bigwhiteshark',
	  doSomething: function() {}
	});

**module Object** 

module 是一个对象，上面存储了与当前模块相关联的一些属性和方法。

## 保留字
sojs


##TODO

* 支持开发者模式，方便代码调试；

* 为sojs提供高性能的构建工具；

* 一键CDN发布功能；




