### 目录

* [config](#config)
    * [base](#base)
    * [alias](#alias)
    * [preload](#preload)
    * [map](#map)
    * [charset](#charset)

### config

可以使用 `config` 方法来配置加载器。

    sojs.config({
      alias: {
        'es5-safe': 'es5-safe/0.9.2/es5-safe',
        'json': 'json/1.0.1/json',
        'jquery': 'jquery/1.7.1/jquery'
      },
      preload: [
        Function.prototype.bind ? '' : 'es5-safe',
        this.JSON ? '' : 'json'
      ],
      map: [
        ['http://example.com/js/app/', 'http://localhost/js/app/']
      ],
      base: 'http://example.com/path/to/libs/',
      charset: 'utf-8'
    });

支持以下配置选项：

#### base

sojs 在解析顶级标识时，会相对 `base` 路径来解析。详情请参阅 [顶级标识](module-identifier.md#top-level-id)。

#### alias

当模块标识很长时，可以使用 `alias` 配置来简化。

    sojs.config({
      alias: {
        'app': 'http://path/to/app',
        'jquery': 'jquery/1.7.1/jquery'
      }
    });

a.js:

    define(function(require, exports, module) {
        var $ = require('jquery');
          // => http://path/to/libs/jquery/1.7.1/jquery.js

        var biz = require('app/biz');
          // => http://path/to/app/biz.js
    });

#### preload

    // 在老浏览器中，提前加载好 ES5 和 json 模块：
    sojs.config({
      preload: [
        Function.prototype.bind ? '' : 'es5-safe',
        this.JSON ? '' : 'json'
      ]
    });

#### map

该配置可将某个文件映射到另一个。可用于在线调试，非常方便。更多信息，请参考<a href="plugin-map.html">映射插件</a>。

#### charset

获取模块文件时，`&lt;script&gt;` 标签的 `charset` 属性。 默认是 `utf-8`。