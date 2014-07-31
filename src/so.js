/**
 * Created by yangxinming on 14-5-22.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
    if (global.sojs) {
        return
    }
    var PATH_RE = /[^?#]*\//,
        PARENT_DIR_RE = /([^\/]*)\/\.\.\/?/,
        DOT_RE = /\/\.\//g,
        MULTI_SLASH_RE = /([^:/])\/+\//g,
        DOMAIN_RE = /^.*?\/\/.*?\//,
        ABSOLUTE_RE = /^\/\/.|:\//,
        DEPS_RE = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        COMMENT_RE = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        PATHS_RE = /^([^/:]+)(\/.+)$/,
        VARS_RE = /{([^{]+)}/g,
        EMPTY_FN = new Function,
        EMPTY = {},
        SYNC_ID = '__sync__',
        JS_EXT = '.js',
        doc = document,
        unique_num = 0,
        head = doc.head || get_tags("head")[0] || doc.documentElement,
        baseElement = get_tags('base', head)[0];

    function guid() {
        return unique_num++;
    }

    function has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function for_each(o, fn) {
        for (var k in o) {
            if (has(o, k) && fn(o[k], k) === false)
                return false
        }
    }

    function strip_comments(code) {
        return code.replace(COMMENT_RE, '');
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

    function inherits(s, b) {
        var f = function() {};
        f.prototype = b.prototype;
        s.prototype = new f
    }

    function get_tags(name, root) {
        return (root || doc).getElementsByTagName(name)
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

    function is_rel_url(it) {
        return it.charAt(0) == '.';
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
        return (/\w+\.js|\/$/.test(path) || path.indexOf("?") > 0) ? path : path + JS_EXT
    }

    function canonical_uri(path, refUri) { //format url
        var firstC = path.charAt(0);
        if (!ABSOLUTE_RE.test(path)) {
            if (firstC === '.') {
                path = (refUri ? dirname(refUri) : opts.cwd) + path;
                path = path.replace(DOT_RE, '/');
                path = path.replace(MULTI_SLASH_RE, "$1/");
                while (PARENT_DIR_RE.test(path)) {
                    path = path.replace(PARENT_DIR_RE, "");
                }
            } else if (firstC === '/') {
                path = opts.domain ? opts.domain + path.substring(1) : path
            } else {
                path = opts.base + path
            }
        }
        if (path.indexOf("//") === 0) {
            path = location.protocol + path
        }
        return path;
    }

    function array_unique(arr) { //ref http://jsperf.com/js-array-unique
        var o = {},
            i, l = arr.length,
            r = [];
        for (i = 0; i < l; i += 1) o[arr[i]] = arr[i];
        for (i in o) r.push(o[i]);
        return r;
    };

    function load_script(url, id, callback) {
        var elem = doc.createElement('script');

        function onload() {
            elem.onload = elem.onerror = elem.onreadystatechange = null;
            head.removeChild(elem);
            elem = null;
            callback()
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
        elem.async = true;
        elem.src = url;
        var charset = opts.charset;
        elem.charset = charset ? is_function(charset) ? charset(url) : charset : 'utf-8';
        elem.id = id;
        baseElement ? head.insertBefore(elem, baseElement) : head.appendChild(elem);
    }

    function get_current_script() {
        if (doc.currentScript) { //firefox 4+,chrome29+
            return doc.currentScript;
        }
        // ref: https://github.com/samyk/jiagra/blob/master/jiagra.js
        var stack;
        try {
            sojs.makeReferenceError();
        } catch (e) {
            stack = e.stack;
            if (!stack && window.opera) {
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }
        }
        if (stack) {
            stack = stack.split(/[@ ]/g).pop();
            stack = stack[0] == "(" ? stack.slice(1, -1) : stack;
            stack = stack.replace(/(:\d+)?:\d+$/i, "");
        }
        var scripts = doc.scripts || get_tags("script", head);
        for (var i = 0, script; script = scripts[i++];) {
            if (script.readyState === "interactive" || script.src === stack) {
                return script;
            }
        }
    }

    function index_of(arr, val) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === val) {
                return i;
            }
        }
        return -1;
    }

    function is_type(type) {
        return function(obj) {
            return EMPTY.toString.call(obj) == '[object ' + type + ']'
        }
    }
    var is_string = is_type('String'),
        is_function = is_type('Function'),
        is_array = Array.isArray || is_type('Array'),
        is_object = is_type('Object');

    function parse_alias(id) {
        var alias = opts.alias;
        return alias && is_string(alias[id]) ? alias[id] : id
    }

    function parse_paths(id) {
        var paths = opts.paths,
            m;
        if (paths && (m = id.match(PATHS_RE)) && is_string(paths[m[1]])) {
            id = paths[m[1]] + m[2]
        }
        return id
    }

    function parse_vars(id) {
        var vars = opts.vars;
        if (vars && id.indexOf("{") > -1) {
            id = id.replace(VARS_RE, function(m, key) {
                return is_string(vars[key]) ? vars[key] : m
            })
        }
        return id
    }

    function parse_map(uri) {
        var map = opts.map,
            ret = uri;
        if (map) {
            for (var i = 0, rule; rule = map[i++];) {
                ret = is_function(rule) ? (rule(uri) || uri) : uri.replace(rule[0], rule[1]);
                if (ret !== uri) break // Only apply the first matched rule                
            }
        }
        return ret
    }

    function id2Mod(id, entry) {
        var deps;
        if (is_array(id)) {
            deps = id;
            id = SYNC_ID + guid(); //async mod id
        }
        var mod = sojs.getMod(id, deps, entry);
        mod.sync && (mod.entry = true);
        return mod;
    }

    function async(id, callback) {
        var mod = id2Mod(id, true);
        sojs.loadMod(mod, function(mod) {
            var args = [];
            for (var i = 0, l = mod.deps.length; i < l; i++) {
                var depMod = sojs.getMod(mod.deps[i]);
                args.push(depMod.exports)
            }
            args.push(mod.exports);
            bind(callback, mod, args);
        })
    }

    function EventTarget() {
        this._listeners = {}
    };
    var p = EventTarget.prototype;
    p.on = function(type, listener) {
        var listeners = this._listeners || (this._listeners = {});
        listeners[type] || (listeners[type] = []);
        if (index_of(listeners[type], listener) == -1) {
            listeners[type].push(listener);
        }
        return listener;
    };

    p.once = function(type, listener) {
        var self = this;
        var lnr = this.on(type, function() {
            listener.apply(this, arguments), self.off(type, lnr)
        });
    }

    p.emit = function(type) {
        if (!this._listeners) return;
        var listeners = this._listeners[type];
        var args = Array.prototype.slice.call(arguments, 1);
        if (listeners) {
            for (var i = 0, listener; listener = listeners[i++];) {
                listener.apply(this, args);
            }
        }
    };

    p.off = function(type, listener) {
        if (!this._listeners) return;
        var listeners = this._listeners[type];
        if (listeners) {
            var index = index_of(listeners, listener);
            index !== -1 && listeners.splice(index, 1);
        }
    };

    function Mod(id, deps, entry, sync, pmod) {
        this.id = id;
        this.sync = sync;
        this.deps = deps || [];
        this.exports = EMPTY;
        this.pmod = pmod;
        this.entry = entry
    }
    inherits(Mod, EventTarget);
    var p = Mod.prototype;

    p.onDefine = function(factory, deps) {
        this.factory = factory;
        if (this.sync) { //if sync mod not parse dependent
            this.deps = [];
        } else {
            var fdeps = parse_deps(factory);
            this.deps = array_unique(deps ? deps.concat(fdeps) : fdeps);
        }
        this.emit('define', this)
    }

    p.onLoad = function() {
        (sojs.mode === 'amd' || this.entry) && this.onExec(); //if entry executed immediately
        this.emit('load', this);
    }

    p.onExec = function() {
        var f = this.factory;
        require.id = this.id; //saved last mod's id to require relative mod.
        var ret = is_function(f) ? bind(f, global, [sojs.require, this.exports = {},
            this
        ]) : f;
        ret && (this.exports = ret);
        this.emit('exec', this);
        delete this.entry;
        delete this.factory;
        delete this.sync;
        delete this.pmod;
        return this.exports
    }

    function ModLoader() {
        this.modMap = {};
    }
    inherits(ModLoader, EventTarget);
    var p = ModLoader.prototype;

    p.getMod = function(id, deps, entry, sync, pmod) {
        if (id instanceof Mod) {
            return id
        } else {
            var prevId = id;
            if (is_rel_url(id)) { //if relative mod , get valid path. for exapmle ./xx/xx/xx
                var modName = id.slice(2),
                    rPrevId = require.prevId,
                    rCurrId = require.id;
                if (rPrevId && is_rel_url(rPrevId) && (rPrevId.split('/').length > 1)) {
                    rCurrId = rCurrId ? rCurrId.replace(rPrevId.slice(2), '') : opts.base
                }
                id = dirname(pmod ? pmod.id : rCurrId) + modName;
            }
            require.prevId = prevId; //remeber last relative id

            var mod = this.modMap[id];
            if (!mod) {
                mod = this.modMap[id] = new Mod(id, deps, entry, sync, pmod);
                mod.uri = this.resolve(id);
                this.emit('resolve', mod);
            }
            return mod;
        }
    }

    p.loadMod = function(mod, callback, pmod) {
        mod = this.getMod(mod, [], pmod && is_sync(pmod.id), null, pmod);
        mod.once('load', callback);
        var self = this;
        this.loadDefine(mod, function() { //recursive to parse mod dependency
            var deps = mod.deps,
                count = deps.length;
            if (!count) {
                mod.onLoad()
            } else {
                for (var i = 0, dep; dep = deps[i++];) {
                    self.loadMod(dep, function() {
                        !--count && mod.onLoad()
                    }, mod)
                }
            }
        })
    }

    p.loadDefine = function(mod, callback) {
        if (mod.exports !== EMPTY) { //If the mod is loaded is returned
            return callback()
        }
        mod.once('define', callback);
        this.emit('request', mod);
        if (!mod.requested) {
            if (is_sync(mod.id) || mod.sync) { //If it is sync mod, immediately executed factory
                mod.onDefine(mod.factory, mod.deps)
            } else {
                load_script(mod.uri, mod.id, function() {
                    mod.onDefine(mod.factory, mod.deps)
                });
            }
        }
    }

    p.getDefine = function(id, deps, factory) {
        var id = id || get_current_script().id,
            mod = this.modMap[id];
        if (mod) { // get deps in define method 
            deps && (mod.deps = mod.deps.concat(deps))
        } else {
            mod = this.getMod(id, [], null, true)
        }
        mod.factory = factory;
    }

    p.resolve = function(id, refUri) {
        if (!id) return ""
        id = parse_alias(id);
        id = parse_paths(id);
        id = parse_vars(id);
        id = normalize(id);
        var uri = canonical_uri(id, refUri)
        uri = parse_map(uri)
        return uri
    }

    p.config = function(options) {
        for_each(options, function(curr, key) {
            var prev = opts[key];
            if (prev && is_object(prev)) {
                for (var k in curr) {
                    prev[k] = curr[k]
                }
            } else {
                if (is_array(prev)) {
                    curr = prev.concat(curr)
                } else if (key === "base") {
                    if (curr.slice(-1) !== "/") {
                        curr += "/"
                    }
                    curr = canonical_uri(curr);
                }
                opts[key] = curr;
            }
        })
    }

    var sojs = global.sojs = new ModLoader(),
        opts = EMPTY,
        cwd = dirname(location.href),
        m = cwd.match(DOMAIN_RE);
    opts.dir = opts.base = (dirname(get_current_script().src) || cwd),
    opts.cwd = cwd,
    opts.domain = m ? m[0] : '';
    sojs.opts = opts;

    sojs.require = function(id, callback, entry) {
        sojs.mode = opts.mode || 'cmd'; // exec mode is cmd   
        if (callback) { //async require
            async(id, callback);
        } else {
            var mod = id2Mod(id, entry);
            if (entry && !mod.sync) {
                sojs.loadMod(mod, EMPTY_FN)
            } else {
                return mod.exports !== EMPTY ? mod.exports : mod.onExec()
            }
        }
    }

    sojs.run = function(id, callback) {
        var preloadMods = opts.preload;
        if (preloadMods) {
            sojs.require(preloadMods, function() {
                sojs.require(id, callback, true)
                delete opts.preload;
            }, true)
        } else {
            return sojs.require(id, callback, true);
        }
    };

    global.define = function(id, deps, factory) {
        var len = arguments.length;
        if (len == 1) { // define(factory)
            factory = id;
            id = null
        } else if (len == 2) { // define(deps, factory)
            factory = deps;
            if (is_array(id)) {
                deps = id;
                id = null
            } else { //define(id, factory)
                deps = null
            }
        }
        sojs.getDefine(id, deps, factory)
    }

    global.require = function(id, callback) {
        return sojs.require(id, callback, true)
    }
    require.async = sojs.require.async = async; //exports async method

})(this)