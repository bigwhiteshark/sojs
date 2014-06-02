/**
 * Created by yangxinming on 14-5-22.
 */
(function() {
    var EMPTY = {},
        PATH_RE = /[^?#]*\//,
        DEPS_RE = /require\(['"]([^'"]+)['"]\)/g,
        doc = document,
        empty = new Function,
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
    function parse_deps(def) {
        var code = strip_comments(def + "");
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
        this.val = EMPTY
    }

    inherits(Mod, EventTarget);
    var p = Mod.prototype;

    p.onLoadDef = function(def) {
        this.def = def;
        this.deps = parse_deps(def);
        this.count = this.deps.length;
        this.trigger("def", this)
    }

    p.onLoad = function() {
        this.val = bind(this.def, null, []);
        this.loading = false;
        this.trigger("mod", this);
        return this.val
    }

    function ModLoader() {
        this.modMap = {};
        this.queues = [];
        this.numUnknowns = 0;
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
        if (mod.val !== EMPTY) {
            callback(mod);
            return
        }
        var this_ = this;
        mod.once("mod", callback);
        if (!mod.loading) {
            mod.loading = true;
            this.loadDef(mod, function() {
                if (!mod.count) {
                    mod.onLoad()
                } else {
                    var deps = mod.deps;
                    for (var i = 0; i < deps.length; i++) {
                        this_.loadMod(deps[i], function() {
                            if (!--mod.count) {
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
        if (mod.def) {
            return callback(mod.def);
        }
        mod.once("def", callback);
        if (!mod.defLoading) {
            mod.defLoading = true;
            if (this.suspended) {
                if (!mod.queued) {
                    this.queues.push(path);
                    mod.queued = true
                }
                mod.defLoading = false
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
    }

    p.getDef = function(def) {
        var mod = this.currentMod;
        delete this.currentMod;
        if (mod) {
            mod.onLoadDef(def);
            this.resume()
        } else {
            mod = this.getMod(this.numUnknowns++);
            mod.onLoadDef(def);
            this.loadMod(mod, empty)
        }
    }

    p.resume = function() {
        this.suspended = false;
        if (this.queues.length) {
            var task = this.queues.shift();
            this.loadDef(task, empty)
        }
    };

    var loader = new ModLoader();
    global['require'] = function(p, callback) {
        if (typeof p === "function") {
            return loader.getDef(p)
        } else if (typeof p === "string") {
            var mod = loader.getMod(p);
            if (callback) {
                loader.loadMod(mod, function(mod) {
                    callback(mod.val)
                })
            } else {
                if (mod.val !== EMPTY) {
                    return mod.val
                }
                loader.loadMod(mod, empty)
            }
		}else if(typeof p === 'object'){
			bootPath = p['base'] + "/"
        } else {
            throw ""
        }
    }
})()
