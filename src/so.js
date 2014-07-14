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
        unique_num = 0,
        currentlyAddingScript,
        interactiveScript,
        head = doc.head || get_tags("head")[0] || doc.documentElement,
        baseElement = get_tags('base',head)[0];

    function has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
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

    function unique(arr){
        var ret = [], o = {};
        for(var i = 0, val; val = arr[i++];){
            if (!o[val]){
                ret.push(val);
                o[val] = 1
            }
        }
        return ret
    }    

    function load_script(url, id) {
        var elem = doc.createElement('script');

        function onload() {
            elem.onload = elem.onerror = elem.onreadystatechange = null
            head.removeChild(elem);
            elem = null;
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

        elem.charset = 'utf-8';
        elem.async = true;
        elem.src = url;
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
        var scripts = doc.scripts || get_tags("script",head);
        for (var i = 0, script; script = scripts[i++];) {
            if (script.readyState === "interactive" || script.src === stack) {
                return script;
            }
        }
    }

    function index_of(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                return i;
            }
        }
        return -1;
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
            for (var i = 0 ,listener; listener = listeners[i++];) {
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
        this.url = canonical(id);
        this.deps = deps || [];
        this.exports = EMPTY;
        this.pmod = pmod;
        this.entry = entry
    }
    inherits(Mod, EventTarget);
    var p = Mod.prototype;

    p.onDefine = function(factory, id, deps) {
        this.factory = factory;
        this.deps = unique(deps.concat(parse_deps(factory)));
        this.emit('define', this)
    }

    p.onLoad = function() {
        this.entry && this.onExec();//if entry executed immediately
        this.emit('load', this);
    }

    p.onExec = function() {
        var f = this.factory;
        require.pid = this.id; //saved last mod's id to require relative mod.
        var ret = (typeof f == 'function') ? bind(f, global, [require, this.exports = {}, this]) : f;
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
        if(id instanceof Mod){
            return id
        }else{
            var firstC = id.charAt(0), //relative path to id
                modName = id.slice(2),
                prevId = id;
            if(firstC === '.'){ //if relative mod , get valid path. for exapmle ./xx/xx/xx 
                if(require.prevId && require.prevId.charAt(0) ===  '.' && (require.prevId.split('/').length>1)) { 
                    require.pid = require.pid ? require.pid.replace(require.prevId.slice(2),'') : cfg.base
                }
                id = dirname(pmod ? pmod.id : require.pid) + modName;
            }
            require.prevId = prevId;//remeber last relative id
            return this.modMap[id] || (this.modMap[id] = new Mod(id, deps, entry, sync, pmod))
        }
    }

    p.loadMod = function(mod, callback, pmod) {
        mod = this.getMod(mod, [], pmod && is_sync(pmod.id),null,pmod);
        var this_ = this;
        mod.once('load', callback);
        this.loadDefine(mod, function() { //recursive to parse mod dependency
            var deps = mod.deps,
                count = deps && deps.length;
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

    p.loadDefine = function(mod, callback) {
        if (mod.exports !== EMPTY) { //If the mod is loaded is returned
            return callback()
        }
        mod.once('define', callback);
        this.emit('request', mod);
        if (!mod.requested) {
            if (is_sync(mod.id) || mod.sync) { //If it is sync mod, immediately executed factory
                this.getDefine(mod.factory,mod.id,mod.deps)
            } else {
               load_script(mod.url,mod.id)
            }
        }
    }

    p.getDefine = function(factory, id, deps) {
        deps = deps || [];
        var script = get_current_script();
        var id = id || script.id;
        var mod = this.modMap[id];
        !mod && (mod = this.getMod(id, deps, null, true)); //sync mod
        mod.onDefine(factory, id, deps);
    }
    var sojs = global.sojs = new ModLoader(),
        cfg = EMPTY,
        cwd = dirname(location.href),
        m = cwd.match(DOMAIN_RE);
    cfg.dir = cfg.base = (dirname(get_current_script().src) || cwd),
    cfg.cwd = cwd,
    cfg.domain = m ? m[0] : '';

    global.define = function(id, deps, factory) {
        var len = arguments.length;
        if (len == 1) {
            factory = id;
            id = null;
        } else if (len == 2) {
            factory = deps;
            is_array(id) ? deps = id : deps = null;
        }
        sojs.getDefine(factory, id, deps)
    }

    global.require = function(id, callback) {
        var caller = arguments.callee.caller,
            caller = caller && caller.caller,
            entry = caller != bind,deps;
        if (is_array(id)) {
            deps = id;
            id = SYNC_ID + get_uid();
        }
        var mod = sojs.getMod(id, deps, entry || callback);
        if (callback) {//async require
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