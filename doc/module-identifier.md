### 目录

* [模块标识](#module-identifier)
    * [相对标识](#relative-id)
    * [顶级标识](#top-level-id)
    * [普通路径](#normal-path)
* [文件后缀的提示](#tips)

### 模块标识

模块标识是一个字符串，用来标识模块。在 `require`等加载函数中，第一个参数都是模块标识。`define`函数的 `deps` 参数也是由模块标识组成。

 sojs 中的模块标识是 [CommonJS 模块标识](http://wiki.commonjs.org/wiki/Modules/1.1.1)的超集:

 >  * 一个模块标识由斜线（`"/"`）分隔的多项组成。
 >  * 每一项必须是小驼峰字符串、`"."` 或 `".."`。
 >  * 模块标识可以不包含文件后缀名，比如 `".js"`。
 >  * 模块标识可以是“相对”或“顶级”标识。如果第一项是 `"."` 或 `".."`，则该模块标识是相对标识。
 >  * 顶级标识根据模块命名空间的根路径来解析。
 >  * 相对标识相对 `require` 所在模块的标识来解析。

 注意，符合上述规范的标识肯定是 sojs 的模块标识，但 sojs 能识别的模块标识不需要完全符合以上规范。
    比如，除了大小写字母组成的小驼峰字符串，sojs 的模块标识字符串还可以包含下划线和连字符，
    甚至可以以 `"http://"`、`"https://"`、`"file:///"` 等协议标识开头。

#### 相对标识

相对标识只出现在模块环境中，以 `"."` 开头。会相对当前模块的 URI 来解析：

    // 在 http://example.com/js/a.js 中：
    require('./b');
    // =&gt; http://example.com/js/b.js

#### 顶级标识

    顶级标识不以点（`"."`）或斜线（`"/"`）开始，会相对 sojs 的 `base` 路径来解析：

    // 假设 base 路径是：http://example.com/js/libs/

    // 在模块代码里：
    require('jquery/1.7.1/jquery');
    // =&gt; http://example.com/js/libs/jquery/1.7.1/jquery.js

 `base` 路径的默认值，与 `so.js` 的路径相关：

    如果 so.js 的路径是：
      http://example.com/js/libs/so.js
    则 base 路径为：
      http://example.com/js/libs/

当 `so.js` 路径中含有版本号时，`base` 不会包含 `sojs/x.y.z` 字串。当类库模块有多个版本时，这样会更方便。

    如果 so.js 的路径是：
      http://example.com/libs/sojs/1.0.0/so.js
    则 base 路径是：
      http://example.com/libs/

当然，也可以手工配置 `base` 路径：

    sojs.config({
      base: 'http://code.jquery.com/'
    });

    // 在模块代码里：
    require('jquery');
    // =&gt; http://code.jquery.com/jquery.js

#### 普通路径

除了相对和顶级标识之外的标识都是普通路径。普通路径的解析规则，和 HTML 代码中的`script.src` 一样，会相对当前页面来解析。

    // 在 http://example.com/js/main.js 中：
    require('http://example.com/js/a');
    // =&gt; http://example.com/js/a.js

    // 在 http://example.com/js/a.js 中：
    require('/js/b');
    // =&gt; http://example.com/js/b.js

    // 在任何代码里：
    sojs.run('./c');
    // =&gt; http://example.com/path/to/page/c.js

  `sojs.run(ids, ...)` 和 `define(id, ...)`中的模块标识始终是普通路径，因为这两个方法是在全局环境中执行的。

  ### 文件后缀的提示


除非在路径中出现井号（`"#"`）或问号（`"?"`），sojs 在解析模块标识时，都会自动添加 JS 扩展名（`".js"`）。如果不想自动添加扩展名，最简单的方法是，在路径末尾加上井号（`"#"`）。

    // ".js" 后缀可以省略：
    require('http://example.com/js/a');
    require('http://example.com/js/a.js');
    // =&gt; http://example.com/js/a.js

    // 当路径中有问号（"?"）时，不会自动添加后缀：
    require('http://example.com/js/a.json?callback=define');
    // =&gt; http://example.com/js/a.json?callback=define

    // 当路径以井号（"#"）结尾时，不会自动添加后缀，且会在解析时，去掉井号：
    require('http://example.com/js/a.json#');
    // =&gt; http://example.com/js/a.json

