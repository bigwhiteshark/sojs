### 目录

* [require 规则](#rules)
    * [正确拼写](#)
    * [不要修改](#)
    * [使用直接量](#)
* [动态依赖的小提示](#)

### 书写规则

使用 `sojs` 书写模块代码时，需要遵循一些简单规则：

#### 正确拼写

在模块代码中，第一个参数 必须 命名为 `require`.

    // 错误！
    define(function(req) {
      // ...
    });

    // 正确！
    define(function(require) {
      // ...
    });

#### 不要修改

不要重命名 `require` 函数，或在任何作用域中给 `require` 重新赋值。

    // 错误 - 重命名 "require"！
    var req = require, mod = req("./mod");

    // 错误 - 重定义 "require"!
    require = function() {};

    // 错误 - 重定义 "require" 为函数参数！
    function F(require) {}

    // 错误 - 在内嵌作用域内重定义了 "require"！
    function F() {
      var require = function() {};
    }

#### 使用直接量

`require` 的参数值 <em>必须</em> 是字符串直接量。

    // 错误！
    require(myModule);

    // 错误！
    require("my-" + "module");

    // 错误！
    require("MY-MODULE".toLowerCase());

    // 正确！
    require("my-module");

  在书写模块代码时，必须遵循这些规则。其实只要把 `require` 看做是语法关键字就好啦。

### 动态依赖的小提示

偶尔会希望可以使用 `require` 来进行条件加载：

    if (todayIsWeekend)
      require("play");
    else
      require("work");

但请牢记，从静态分析的角度来看，这个模块同时依赖 play 和 work 两个模块，加载器会把这两个模块文件都下载下来。这种情况下，推荐使用 `require(id,callback)` 异步来进行条件加载。