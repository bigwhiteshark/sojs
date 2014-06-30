/**
 * Created by yangxinming on 14-5-22.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
    var EMPTY = {},
        PATH_RE = /[^?#]*\//,
        PARENT_DIR_RE = /([^\/]*)\/\.\.\/?/,
        DOT_RE = /\/\.\//g,
        MULTI_SLASH_RE = /([^:/])\/+\//g,
        DOMAIN_RE = /^.*?\/\/.*?\//,
        ABSOLUTE_RE = /^\/\/.|:\//,
        DEPS_RE = /require\(['"]([^'"]+)['"]\)/g,
        EMPTY_FN = new Function,
        SYNC_ID = '__sync__',
        JS_EXT = '.js',
        doc = document,
        unique_num = 0;

    function has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key)
    }

    function for_in(o, fn) {
        for (var k in o)
            if (has(o, k) && fn(o[k], k) === false)
                return false
    }

    function strip_comments(code) {
        var reComment = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
        return code.replace(reComment, '');
    }

    function bind(fn, context, vargs) {
        try {
            return fn.apply(context, vargs || [])
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

    function get_uid() {
        return ++unique_num;
    }

    function inherits(s, b) {
        var f = function() {};
        f.prototype = b.prototype;
        s.prototype = new f
    }

    function get_tags(name, root) {
        return (root || doc).getElementsByTagName(name)
    }

    function get_script_src() {
        var scripts = doc.scripts || get_tags('script');
        return scripts[scripts.length - 1].getAttribute('src') || '';
    }

    function is_array(obj) {
        return obj instanceof Array
    }

    function parse_deps(factory) {
        var code = strip_comments(factory + ''),
            match, ret = [];
        while (match = DEPS_RE.exec(code)) {
            match[1] && ret.push(match[1])
        }
        return ret
    }

    function is_sync(id) {
        return new RegExp(SYNC_ID).test(id)
    }

    function dirname(path) {
        var m = path.match(PATH_RE);
        return m ? m[0] : ''
    }

    function normalize(path) {
        var last = path.length - 1;
        var lastC = path.charAt(last);
        if (lastC === "#") {
            return path.substring(0, last)
        }
        return (path.substring(last - 2) === JS_EXT || path.indexOf("?") > 0 || lastC === "/") ? path : path + JS_EXT
    }

    function canonical(path) {
        path = normalize(path);
        path = path.replace(DOT_RE, '/');
        path = path.replace(MULTI_SLASH_RE, "$1/");
        while (PARENT_DIR_RE.test(path)) {
            path = path.replace(PARENT_DIR_RE, "");
        }
        var firstC = path.charAt(0);
        if (!ABSOLUTE_RE.test(path)) {
            if (firstC === '.') {
                path = cfg.cwd + path;
            } else if (firstC === '/') {
                path = cfg.domain + path.substring(1)
            } else {
                path = cfg.base + path
            }
        }
        if (path.indexOf("//") === 0) {
            path = location.protocol + path
        }
        return path;
    }

    function load_script(url){
        var elem = doc.createElement('script'),
            head = doc.head || get_tags("head")[0];

        function onload() {
            elem.onload = elem.onerror = elem.onreadystatechange = null
            head.removeChild(elem);
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
        elem.src = url;
        elem.charset = 'utf-8';
        head.appendChild(elem)
    }

    function EventHandle(handles, guid) {
        this.handles = handles;
        this.guid = guid
    }
    var p = EventHandle.prototype;
    p.dispose = function() {
        delete this.handles[this.guid]
    }

    function get_handles(target, type) {
        var handles;
        return (handles = target.handles || (target.handles = {})) && (handles[type] || (handles[type] = {}))
    }

    function EventTarget() {}
    var p = EventTarget.prototype;
    p.on = function(type, handle) {
        var handles = get_handles(this, type);
        var guid = get_uid();
        handles[guid] = handle;
        return new EventHandle(handles, guid)
    }
    p.once = function(type, func) {
        var handle = this.on(type, function() {
            return func.apply(this, arguments), handle.dispose()
        });
        return handle
    }
    p.emit = function(type, args) {
        var this_ = this;
        return reduce(get_values(get_handles(this, type)), function(prevVal, handle) {
            return bind(handle, this_, [args])
        }, true)
    }

    function Mod(id, deps, entry, sync) {
        this.id = id;
        this.sync = sync;
        this.url = !sync ? canonical(id) : '';
        this.deps = deps || [];
        this.exports = EMPTY;
        this.entry = entry
    }
    inherits(Mod, EventTarget);
    var p = Mod.prototype;

    p.onDefine = function(factory, id, deps) {
        this.factory = factory;
        if(!deps) debugger;
        this.deps = deps.concat(parse_deps(factory));
        this.emit('define', this)
    }

    p.onLoad = function() {
        this.entry && this.onExec();
        this.emit('load', this);
    }

    p.onExec = function() {
        var f = this.factory;
        var ret = (typeof f == 'function') ? bind(f, global, [require, this.exports = {}, this]) : f;
        ret && (this.exports = ret);
        this.emit('exec', this);
        delete this.entry;
        delete this.loading;
        delete this.handles;
        delete this.factory;
        delete this.deps;
        delete this.sync;
        return this.exports
    }

    function ModLoader() {
        this.modMap = {};
        this.queues = [];
    }
    inherits(ModLoader, EventTarget);
    var p = ModLoader.prototype;

    p.getMod = function(mod, deps, entry, sync) {
        return mod instanceof Mod && mod || this.modMap[mod] || (this.modMap[mod] = new Mod(mod, deps, entry, sync))
    }

    p.loadMod = function(mod, callback, pMod) {
        mod = this.getMod(mod, [], pMod && is_sync(pMod.id));
        var this_ = this;
        mod.once('load', callback);
        if (!mod.loading) {
            mod.loading = true;
            this.loadDefine(mod, function() {
                var deps = mod.deps,
                    count = mod.deps.length;
                if (!count) {
                    mod.onLoad()
                } else {
                    for (var i = 0; i < deps.length; i++) {
                        this_.loadMod(deps[i], function() {
                            !--count && mod.onLoad()
                        }, mod)
                    }
                }
            })
        }
    }

    p.loadDefine = function(mod, callback) {
        mod.once('define', callback);
        if (this.runing) {
            this.queues.push(mod);
        } else {
            this.runing = true;
            this.currentMod = mod;
            this.emit('request', mod);
            if (!mod.requested) {
                if (is_sync(mod.id) || !mod.url) {
                    this.getDefine()
                } else {
                    load_script(mod.url)
                }
            }
        }
    }

    p.getDefine = function(factory, id, deps) {
        var mod = this.currentMod,
            deps = deps || [];
        delete this.currentMod;
        if (mod) {
            mod.onDefine(factory || mod.factory, id, mod.deps || []);
            this.runing = false;
            if (this.queues.length) {
                var mod = this.queues.shift();
                this.loadDefine(mod, EMPTY_FN)
            }
        } else {
            mod = this.getMod(id,[],null,true);
            mod.onDefine(factory, id, deps);
            this.loadMod(mod, EMPTY_FN);
        }
    }
    var sojs = global.sojs = new ModLoader(),
        cfg = EMPTY,
        cwd = dirname(location.href),
        m = cwd.match(DOMAIN_RE);
    cfg.dir = cfg.base = (dirname(get_script_src()) || cwd),
    cfg.cwd = cwd,
    cfg.domain = m ? m[0] : '';

    global.define = function(id, deps, factory) {
        var len = arguments.length;
        if (len == 1) {
            factory = id;
        } else if (len == 2) {
            factory = deps;
            is_array(id) ? deps = id : deps = null;
        }
        sojs.getDefine(factory, id, deps)
    }

    global.require = function(id, callback) {
        var caller = arguments.callee.caller,
            caller = caller && caller.caller,
            entry = caller != bind,
            deps;
        if (is_array(id)) {
            deps = id;
            id = SYNC_ID + get_uid();
        }
        var mod = sojs.getMod(id, deps, entry || callback);
        if (callback) {
            sojs.loadMod(mod, function(mod) {
                var args = [];
                for (var i = 0, l = mod.deps.length; i < l; i++) {
                    var depMod = sojs.modMap[mod.deps[i]];
                    args.push(depMod.exports)
                }
                args.push(mod.exports);
                bind(callback, mod, args);
            })
        } else {
            if (entry && !mod.sync) {
                sojs.loadMod(mod, EMPTY_FN)
            } else {
                return mod.exports !== EMPTY ? mod.exports : mod.onExec()
            }
        }
    }

    sojs.config = function(pathMap) {
        cfg.base = pathMap.base
    }
})(this)