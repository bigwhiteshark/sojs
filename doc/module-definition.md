### 目录

* 模块定义
    * define
        * [id](#define-id)
        * [deps](#define-deps)
        * [factory](#define-factory)
    * [exports](#exports)
    * require
        * [id](#require-id)
        * [callback](#require-callback)
        * [require.async](#require-async)
    * module
        * module.id
        * module.deps
        * module.exports

### 模块定义

在 sojs 中，所有 JavaScript 文件都应该用模块的形式来书写，并且一个文件只包含一个模块。

### define 

使用全局函数 `define` 来定义模块：

define 接受 `factory` 参数，`factory` 可以是一个函数，也可以是一个对象或字符串。

factory提供了3个参数：`require`, `exports`, `module`，用于模块的引用和导出。
  
    define (factory);

    define(id?, deps?, factory);

####id

 当前模块的唯一标识。该参数可选。如果没有指定，默认为模块所在文件的访问路径。如果指定的话，必须是顶级或绝对标识（不能是相对标识）。

####deps {#define-deps}

当前模块所依赖的模块，是一个由模块标识组成的数组。该参数可选。如果没有指定，模块加载器会从`factory.toString()`中解析出该数组。

####factory

模块的工厂函数。模块初始化时，会调用且仅调用一次该工厂函数。`factory`可以是函数，也可以是对象、字符串等任意值，这时`module.exports` 会直接设置为`factory`值。

`factory` 函数在调用时，会始终传入三个参数：`require`、`exports` 和 `module`，这三个参数在所有模块代码里可用。

    define(function(require, exports, module) {

      // The module code goes here
      
    });

    define({ name: "bigwhiteshark" });

    define('I am sojs that a tiny javascript on-demand module loader.');

###exports

`exports` 是一个对象，用来向外提供模块接口。

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

  ** 注意：下面这种写法是错误的！

    define(function(require, exports) {
      exports = { // 错误!
        foo: 'bar'，
        doSomething: function() {};
      };
    });

模块加载器不能获取到新赋给 `exports` 变量的值。请使用 `return` 或 `module.exports` 。

###require

####id

当前模块的唯一标识。该参数必选。

`require`是一个全局函数，也可以是 `factory` 函数的第一个参数。

**require require(id)**

`require` 是一个方法，接受 [模块标识](module-identifier.html "模块标识") 作为参数，用来访问其他模块提供的接口。

    //全局方法，引用printer模块
    var printer = require('mods/printer');
    //调用模块 printer 的方法
    printer.echo();

    define(function(require, exports) {

      // 获取模块 a 的接口
      var a = require('./a');

      // 调用模块 a 的方法
      a.doSomething();

    });

**注意：** 在开发时，`require` 的书写需要遵循一些 简单约定。

####callback

模块内部异步加载模块，加载完成后执行的回调的方法;

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

####require.async

该方法可用来异步加载模块，并在加载完成后执行回调函数。与 `require(id, callback?)` 等价，不推荐使用。

    define(function(require, exports, module) {
      // 加载一个模块
      require.async('./b', function(b) {
        b.doSomething();
      });
      
      // 加载多个模块
      require.async(['./c', './d'], function(c, d) {
        // do something
      });
    });
