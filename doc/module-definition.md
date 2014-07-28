### 目录

* 模块定义
    * define
        * id
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
  
