/**
 * Created by yangxinming on 14-5-22.
 * https://github.com/bigwhiteshark/sojs
 */
(function() {
    var EMPTY = {},
        PATH_RE = /[^?#]*\//,
        DEPS_RE = /require\(['"]([^'"]+)['"]\)/g,
        doc = document,
        EMPTY_FN = new Function,
        bootPath = get_script_path(),
        head = doc.head,
        global = this;

    function has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key)
    }

    function for_in(o, fn) {
        for (var k in o)
            if (has(o, k)) {
                if (fn(o[k], k) === false)
                    return false;
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
        return ret;
    }

    var get_uid = function() {
        var num = -1,
            key = (+new Date).toString(32);
        return function(obj) {
            return obj[key] || (obj[key] = ":" + ++num)
        }
    }()

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
        return (handles = target._handles || force && (target._handles = {})) 
                && (handles[type] || force && (handles[type] = {}))
    }

    function EventTarget() {}

    var p = EventTarget.prototype;
    p.on = function(type, handle) {
        var handles = getHandles(this, type, true);
        var uid = get_uid(handle);
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
        s.prototype = new f;
    }

    function tags(name, root) {
        return (root || doc).getElementsByTagName(name)
    }

    function get_script_path() {
        var scripts = tags("script");
        var url = scripts[scripts.length - 1].getAttribute("src");
        var result = url.match(PATH_RE);
        return result ? result[0] : './'
    }

    function parse_deps(factory) {
        var code = strip_comments(factory + "");
        var match;
        var ret = [];
        while (match = DEPS_RE.exec(code)) {
            if (match[1]) {
                ret.push(match[1])
            }
        }
        return ret
    }

    function Mod(path) {
        this._path = path;
        this._fullPath = bootPath + path;
        this.exports = EMPTY;
    }

    inherits(Mod, EventTarget);
    var p = Mod.prototype;

    p.onDefine = function(factory) {
        this.factory = factory;
        this.deps = parse_deps(factory);
        this.trigger("define", this)
    }

    p.onLoad = function() {
        var factory = this.factory;
        var ret =  (typeof factory == 'function')
                ? bind(factory,this,[require, this.exports, this])
                :factory;
        ret && (this.exports = ret);
        this.loading = false;
        this.trigger("load", this);
        return this.exports
    }

    function ModLoader() {
        this.modMap = {};
        this.queues = [];
    }
    inherits(ModLoader, EventTarget);

    var p = ModLoader.prototype;
    p.getMod = function(mod) {
        if (mod instanceof Mod) {
            this.modMap[mod._path] = mod;
            return mod
        } else {
            return this.modMap[mod] || (this.modMap[mod] = new Mod(mod))
        }
    }

    p.loadMod = function(mod, callback) {
        mod = this.getMod(mod);
        if (mod.exports !== EMPTY) {
            callback(mod);
            return
        }
        var this_ = this;
        mod.once("load", callback);
        if (!mod.loading) {
            mod.loading = true;
            this.loadDef(mod, function() {
                var count = mod.deps.length;
                if (!count) {
                    mod.onLoad()
                } else {
                    var deps = mod.deps;
                    for (var i = 0; i < deps.length; i++) {
                        this_.loadMod(deps[i], function() {
                            if (!--count) {
                                return mod.onLoad()
                            }
                        }, mod._path)
                    }
                }
            })
        }
    }

    p.loadDef = function(path, callback) {
        var mod = this.getMod(path);
        mod.once("define", callback);
        if (this.suspended) {
            if (!mod.queued) {
                this.queues.push(path);
                mod.queued = true
            }
        } else {
            this.suspended = true;
            this.currentMod = mod;
            var node = doc.createElement("script");

            function onload() {
                node.onload = node.onerror = node.onreadystatechange = null
                head.removeChild(node)
                node = null
            }
            if ("onload" in node) {
                node.onload = onload;
                node.onerror = function() {
                    onload()
                }
            } else {
                node.onreadystatechange = function() {
                    if (/loaded|complete/.test(node.readyState)) {
                        onload()
                    }
                }
            }
            node.src = mod._fullPath;
            node.charset = 'utf-8';
            head.appendChild(node)
        }
    }

    p.getDef = function(factory) {
        var mod = this.currentMod;
        delete this.currentMod;
        mod.onDefine(factory);
        this.resume()
    }

    p.resume = function() {
        this.suspended = false;
        if (this.queues.length) {
            var mod = this.queues.shift();
            this.loadDef(mod, EMPTY_FN)
        }
    };

    var loader = new ModLoader();
    global['define'] = function (p){
        return loader.getDef(p)
    };
    global['require'] = function(id, callback) {
        var mod = loader.getMod(id);
        if (callback) {
            loader.loadMod(mod, function(mod) {
                callback(mod.exports)
            })
        } else {
            if (mod.exports !== EMPTY) {
                return mod.exports
            }
            loader.loadMod(mod, EMPTY_FN)
        }
    }

    bootPath =  "./";
})()