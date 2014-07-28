### 目录

* 模块定义
    * define
        * [id](#define-id)
        * deps
        * factory
    * exports
    * require
        * id
        * callback
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

    define(id?, dependencies?, factory);

#### id[define-id]

 当前模块的唯一标识。该参数可选。如果没有指定，默认为模块所在文件的访问路径。如果指定的话，必须是顶级或绝对标识（不能是相对标识）。

#### dependencies[define-dependencies]

当前模块所依赖的模块，是一个由模块标识组成的数组。该参数可选。如果没有指定，模块加载器会从`factory.toString()`中解析出该数组。

#### factory[define-factory]

模块的工厂函数。模块初始化时，会调用且仅调用一次该工厂函数。`factory`可以是函数，也可以是对象、字符串等任意值，这时`module.exports` 会直接设置为`factory`值。

`factory` 函数在调用时，会始终传入三个参数：`require`、`exports` 和 `module`，这三个参数在所有模块代码里可用。

    define(function(require, exports, module) {

      // The module code goes here
      
    });

    define({ name: "bigwhiteshark" });

    define('I am sojs that a tiny javascript on-demand module loader.');