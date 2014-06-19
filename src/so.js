/**
 * Created by yangxinming on 14-5-22.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
    var EMPTY = {},
        PATH_RE = /[^?#]*\//,
        DEPS_RE = /require\(['"]([^'"]+)['"]\)/g,
        EMPTY_FN = new Function,
        SYNC_ID = '__sync__',
        EXT_JS = '.js',
        doc = document,
        bootPath = get_script_path(),
        head = doc.head || doc.getElementsByTagName("head")[0] ;

    function has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key)
    }

    function for_in(o, fn) {
        for (var k in o)
            if (has(o, k)) {
                if (fn(o[k], k) === false)
                    return false
            }
    }

    function strip_comments(code) {
        var reComment = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
        return code.replace(reComment, '');
    }

    function bind(fn, thisp, vargs) {
        try {
            return fn.apply(thisp, vargs || [])
        } catch (ex) {
            setTimeout(function() {
                throw ex
            }, 0)
        }
    }

    function reduce(array, fn, value) {
        for (var i = 0; i < array.length; i++) {
            value = fn(value, array[i], i, array)
        }
        return value
    }

    function get_values(obj) {
        var ret = [];
        for_in(obj, function(value) {
            ret.push(value);
        });
        return ret
    }

    var num = 0;
    function get_uid() {
        return ++num;
    }

    function EventHandle(handles, uid) {
        this.handles = handles;
        this.uid = uid
    }
    var p = EventHandle.prototype;
    p.dispose = function() {
        delete this.handles[this.uid]
    }

    function getHandles(target, type, force) {
        var handles;
        return (handles = target._handles || force && (target._handles = {})) && (handles[type] || force && (handles[type] = {}))
    }

    function EventTarget() {}
    var p = EventTarget.prototype;
    p.on = function(type, handle) {
        var handles = getHandles(this, type, true);
        var uid = get_uid();
        handles[uid] = handle;
        return new EventHandle(handles, uid)
    }
    p.once = function(type, func) {
        var handle = this.on(type, function() {
            return func.apply(this, arguments), handle.dispose()
        });
        return handle
    }
    p.trigger = function(type, args) {
        var this_ = this;
        return reduce(get_values(getHandles(this, type, false)), function(prevVal, handle) {
            return bind(handle, this_, [args])
        }, true)
    }

    function inherits(s, b) {
        var f = function() {};
        f.prototype = b.prototype;
        s.prototype = new f
    }

    function get_tags(name, root) {
        return (root || doc).getElementsByTagName(name)
    }

    function get_script_path() {
        var scripts = get_tags('script');
        var url = scripts[scripts.length - 1].getAttribute('src');
        var result = url.match(PATH_RE);
        return result ? result[0] : './'
    }

    function is_array(obj) {
        return  obj instanceof Array
    }

    function parse_deps(factory) {
        var code = strip_comments(factory + ''),
            match, ret = [];
        while (match = DEPS_RE.exec(code)) {
            match[1] && ret.push(match[1])
        }
        return ret
    }

    function Mod(uri, deps) {
        this.uri = uri;
        this.deps = deps || [];
        this.exports = EMPTY
    }
    inherits(Mod, EventTarget);
    var p = Mod.prototype;

    p.onDefine = function(factory, id, deps) {
        this.factory = factory;
        this.deps = deps.concat(parse_deps(factory));
        this.trigger('define', this)
    }

    p.onLoad = function() {
        var f = this.factory;
        var ret = (typeof f == 'function') ? bind(f, this, [require, this.exports = {},this]) : f;
        ret && (this.exports = ret);
        this.loading = false;
        this.trigger('load', this);
        return this.exports
    }

    function ModLoader() {
        this.modMap = {};
        this.queues = [];
    }
    inherits(ModLoader, EventTarget);

    var p = ModLoader.prototype;
    p.getMod = function(mod, deps) {
        if (mod instanceof Mod) {
            this.modMap[mod.uri] = mod;
            return mod
        } else {
            return this.modMap[mod] || (this.modMap[mod] = new Mod(mod, deps))
        }
    }

    p.loadMod = function(mod, callback) {
        mod = this.getMod(mod);
        if(mod.exports !== EMPTY) {
            return callback(mod)
        }
        var this_ = this;
        mod.once('load', callback);
        if (!mod.loading) {
            mod.loading = true;
            this.loadDef(mod, function() {
                var deps = mod.deps, count = mod.deps.length;
                if (!count) {
                    mod.onLoad()
                } else {
                    for (var i = 0; i < deps.length; i++) {
                        this_.loadMod(deps[i], function() {
                            !--count && mod.onLoad()
                        }, mod.uri)
                    }
                }
            })
        }
    }

    p.loadDef = function(uri, callback) {
        var mod = this.getMod(uri);
        mod.once('define', callback);
        if (this.waiting) {
            this.queues.push(uri);
        } else {
            this.waiting = true;
            this.currentMod = mod;
            if (new RegExp(SYNC_ID).test(mod.uri) || mod.sync) {
                this.getDef()
            } else {
                var elem = doc.createElement('script');
                function onload() {
                    elem.onload = elem.onerror = elem.onreadystatechange = null
                    head.removeChild(elem)
                    elem = null
                }
                if ('onload' in elem) {
                    elem.onload = onload;
                    elem.onerror = function() {
                        onload()
                    }
                } else {
                    elem.onreadystatechange = function() {
                        if (/loaded|complete/.test(elem.readyState)) {
                            onload()
                        }
                    }
                }
                var url = bootPath + mod.uri;
                !new RegExp(EXT_JS+'$','i').test(url) && (url += EXT_JS); 
                elem.src = url;
                elem.charset = 'utf-8';
                head.appendChild(elem)
            }
        }
    }

    p.getDef = function(factory, id, deps) {
        var mod = this.currentMod,deps = deps || [];
        delete this.currentMod;
        if(mod){
            mod.onDefine(factory || mod.factory, id, mod.sync ? deps : mod.deps);
            this.resume()
        }else {
            mod = this.getMod(id);
            mod.sync = true;
            mod.onDefine(factory,id, deps);
            this.loadMod(mod, EMPTY_FN);
        }
    }

    p.resume = function() {
        this.waiting = false;
        if (this.queues.length) {
            var mod = this.queues.shift();
            this.loadDef(mod, EMPTY_FN)
        }
    }

    var loader = new ModLoader(),sojs = global.sojs = {};
    sojs.config = function(pathMap) {
        bootPath = pathMap['base']
    }

    global.define = function(id, deps, factory) {
        var len = arguments.length;
        if (len == 1) {
            factory = id;
        } else if (len == 2) {
            factory = deps;
            is_array(id) ? deps = id : deps = null;
        }
        loader.getDef(factory, id, deps)
    }

    global.require = function(id, callback) {
        var deps;
        if (is_array(id)) {
            deps = id;
            id = SYNC_ID + get_uid();
        }
        var mod = loader.getMod(id, deps);
        if (callback) {
            loader.loadMod(mod, function(mod) {
                var args = [];
                for (var i = 0, l = mod.deps.length; i < l; i++) {
                    var depMod = loader.modMap[mod.deps[i]];
                    args.push(depMod.exports)
                }
                args.push(mod.exports);
                bind(callback, mod, args);
            })
        } else {
            if (mod.exports !== EMPTY) {
                return mod.exports
            }
            loader.loadMod(mod, EMPTY_FN)
        }
    }
})(this)