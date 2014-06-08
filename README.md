#  sojs

## 简介
一个极简极小的符合AMD/CMD规范按需模块加载器，特点是小巧、简洁、轻量级，目的使开发者能够快速上手，无学习成本，按模块开发。

sosj是一个符合AMD/CMD规范（进行中...），目的在于希望开发者能够按模块开发，像使用java、c++、python、php等语言一样，有模块的概念，可以导入模块。通过使用sojs可以像nodeJs一样按模块进进行编程。

## 使用

**模块的定义**

使用define来定义一个模块，define 是一个全局函数，用来定义模块:

**define** (factory)	

define 接受 factory 参数，factory 可以是一个函数，也可以是一个对象或字符串。

factory提供了3个参数：**require**, **exports**, **module**，用于模块的引用和导出。

代码示例：

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

  **define** (id?,deps?,depenfactory) 

  define 也可以接受两个以上参数。字符串 id 表示模块标识，数组 deps 是模块依赖。

  **注：暂时不支持，实现中...**

**模块的引用**

**require Function**

require是一个全局函数，也可以是 factory 函数的第一个参数。

require require(id)

require 是一个方法，接受 模块标识 作为唯一参数，用来获取其他模块提供的接口。和NodeJS里获取模块的方式一样，非常简单。

代码示例
		
		define(function(require, exports) {

		  // 获取模块 a 的接口
		  var a = require('./a.js');

		  // 调用模块 a 的方法
		  a.doSomething();

		});

**注意：** 在开发时，require 的书写需要遵循一些 简单约定。

**require(id, callback?)**


##TODO

*并且支持开发者模式，方便代码调试；

*同时可以根据提供的高性能的构建工具；




