### 目录

* [config](#config)
    * [base](#base)
    * [alias](#alias)
    * [paths](#paths)
    * [vars](#vars)
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

#### base `String`

sojs 在解析顶级标识时，会相对 `base` 路径来解析。详情请参阅 [顶级标识](module-identifier.md#top-level-id)。

#### alias `Object`

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

paths `Object`

当目录比较深，或需要跨目录调用模块时，可以使用 `paths` 来简化书写。

    sojs.config({
      paths: {
        'gallery': 'https://a.alipayobjects.com/gallery',
        'app': 'path/to/app',
      }
    });


    define(function(require, exports, module) {

       var underscore = require('gallery/underscore');
         //=> 加载的是 https://a.alipayobjects.com/gallery/underscore.js

       var biz = require('app/biz');
         //=> 加载的是 path/to/app/biz.js

    });

paths 配置可以结合 `alias` 配置一起使用，让模块引用非常方便。

vars `Object`

有些场景下，模块路径在运行时才能确定，这时可以使用 `vars` 变量来配置。

    sojs.config({
      vars: {
        'locale': 'zh-cn'
      }
    });


    define(function(require, exports, module) {

      var lang = require('./i18n/{locale}.js');
         //=> 加载的是 path/to/i18n/zh-cn.js

    });

`vars` 配置的是模块标识中的变量值，在模块标识中用 `{key}` 来表示变量。

#### preload `Array`

    // 在老浏览器中，提前加载好 ES5 和 json 模块：
    sojs.config({
      preload: [
        Function.prototype.bind ? '' : 'es5-safe',
        this.JSON ? '' : 'json'
      ]
    });

#### map `Array`

该配置可将某个文件映射到另一个。可用于版本更新或在线调试，非常方便。

#### charset `String | Function`

获取模块文件时，`&lt;script&gt;` 标签的 `charset` 属性。 默认是 `utf-8`。