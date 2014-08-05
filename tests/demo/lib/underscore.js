define(function(require, exports, module) {
    (function() {
        var j = this,
            u = j._,
            p = {},
            g = Array.prototype,
            o = Object.prototype,
            k = g.push,
            f = g.slice,
            w = g.concat,
            r = o.toString,
            y = o.hasOwnProperty,
            D = g.forEach,
            l = g.map,
            q = g.reduce,
            s = g.reduceRight,
            E = g.filter,
            v = g.every,
            n = g.some,
            h = g.indexOf,
            F = g.lastIndexOf,
            o = Array.isArray,
            K = Object.keys,
            z = Function.prototype.bind,
            b = function(a) {
                if (a instanceof b) return a;
                if (!(this instanceof b)) return new b(a);
                this._wrapped = a
            };
        j._ = b;
        b.VERSION = "1.4.2";
        var m = b.each = b.forEach = function(a, c, d) {
            if (a != null)
                if (D && a.forEach === D) a.forEach(c, d);
                else if (a.length === +a.length)
                for (var e = 0, t = a.length; e < t; e++) {
                    if (c.call(d, a[e], e, a) === p) break
                } else
                    for (e in a)
                        if (b.has(a, e) && c.call(d, a[e], e, a) === p) break
        };
        b.map = b.collect = function(a, c, d) {
            var b = [];
            if (a == null) return b;
            if (l && a.map === l) return a.map(c, d);
            m(a, function(a, i, f) {
                b[b.length] = c.call(d, a, i, f)
            });
            return b
        };
        b.reduce = b.foldl = b.inject = function(a, c, d, e) {
            var t = arguments.length > 2;
            a == null && (a = []);
            if (q && a.reduce === q) {
                e && (c = b.bind(c, e));
                return t ? a.reduce(c, d) : a.reduce(c)
            }
            m(a, function(a, b, f) {
                if (t) d = c.call(e, d, a, b, f);
                else {
                    d = a;
                    t = true
                }
            });
            if (!t) throw new TypeError("Reduce of empty array with no initial value");
            return d
        };
        b.reduceRight = b.foldr = function(a, c, d, e) {
            var t = arguments.length > 2;
            a == null && (a = []);
            if (s && a.reduceRight === s) {
                e && (c = b.bind(c, e));
                return arguments.length > 2 ? a.reduceRight(c, d) : a.reduceRight(c)
            }
            var i = a.length;
            if (i !== +i) var f = b.keys(a),
                i = f.length;
            m(a, function(b, g, h) {
                g = f ? f[--i] : --i;
                if (t) d = c.call(e, d, a[g], g, h);
                else {
                    d = a[g];
                    t = true
                }
            });
            if (!t) throw new TypeError("Reduce of empty array with no initial value");
            return d
        };
        b.find = b.detect = function(a, c, b) {
            var e;
            G(a, function(a, i, f) {
                if (c.call(b, a, i, f)) {
                    e = a;
                    return true
                }
            });
            return e
        };
        b.filter = b.select = function(a, c, b) {
            var e = [];
            if (a == null) return e;
            if (E && a.filter === E) return a.filter(c, b);
            m(a, function(a, i, f) {
                c.call(b, a, i, f) && (e[e.length] = a)
            });
            return e
        };
        b.reject = function(a, c, b) {
            var e = [];
            if (a == null) return e;
            m(a, function(a, i, f) {
                c.call(b, a, i, f) || (e[e.length] = a)
            });
            return e
        };
        b.every = b.all = function(a, c, d) {
            c || (c = b.identity);
            var e = true;
            if (a == null) return e;
            if (v && a.every === v) return a.every(c, d);
            m(a, function(a, b, f) {
                if (!(e = e && c.call(d, a, b, f))) return p
            });
            return !!e
        };
        var G = b.some = b.any =

            function(a, c, d) {
                c || (c = b.identity);
                var e = false;
                if (a == null) return e;
                if (n && a.some === n) return a.some(c, d);
                m(a, function(a, b, f) {
                    if (e || (e = c.call(d, a, b, f))) return p
                });
                return !!e
            };
        b.contains = b.include = function(a, c) {
            var b = false;
            if (a == null) return b;
            if (h && a.indexOf === h) return a.indexOf(c) != -1;
            return b = G(a, function(a) {
                return a === c
            })
        };
        b.invoke = function(a, c) {
            var d = f.call(arguments, 2);
            return b.map(a, function(a) {
                return (b.isFunction(c) ? c : a[c]).apply(a, d)
            })
        };
        b.pluck = function(a, c) {
            return b.map(a, function(a) {
                return a[c]
            })
        };
        b.where = function(a, c) {
            return b.isEmpty(c) ? [] : b.filter(a, function(a) {
                for (var b in c)
                    if (c[b] !== a[b]) return false;
                return true
            })
        };
        b.max = function(a, c, d) {
            if (!c && b.isArray(a) && a[0] === +a[0] && a.length < 65535) return Math.max.apply(Math, a);
            if (!c && b.isEmpty(a)) return -Infinity;
            var e = {
                computed: -Infinity
            };
            m(a, function(a, b, f) {
                b = c ? c.call(d, a, b, f) : a;
                b >= e.computed && (e = {
                    value: a,
                    computed: b
                })
            });
            return e.value
        };
        b.min = function(a, c, d) {
            if (!c && b.isArray(a) && a[0] === +a[0] && a.length < 65535) return Math.min.apply(Math, a);
            if (!c && b.isEmpty(a)) return Infinity;
            var e = {
                computed: Infinity
            };
            m(a, function(a, b, f) {
                b = c ? c.call(d, a, b, f) : a;
                b < e.computed && (e = {
                    value: a,
                    computed: b
                })
            });
            return e.value
        };
        b.shuffle = function(a) {
            var c, d = 0,
                e = [];
            m(a, function(a) {
                c = b.random(d++);
                e[d - 1] = e[c];
                e[c] = a
            });
            return e
        };
        var A = function(a) {
            return b.isFunction(a) ? a : function(c) {
                return c[a]
            }
        };
        b.sortBy = function(a, c, d) {
            var e = A(c);
            return b.pluck(b.map(a, function(a, c, b) {
                return {
                    value: a,
                    index: c,
                    criteria: e.call(d, a, c, b)
                }
            }).sort(function(a, c) {
                var b = a.criteria,
                    d = c.criteria;
                if (b !== d) {
                    if (b > d || b === void 0) return 1;
                    if (b < d || d === void 0) return -1
                }
                return a.index < c.index ? -1 : 1
            }), "value")
        };
        var H = function(a, c, b, e) {
            var f = {},
                i = A(c);
            m(a, function(c, g) {
                var h = i.call(b, c, g, a);
                e(f, h, c)
            });
            return f
        };
        b.groupBy = function(a, c, d) {
            return H(a, c, d, function(a, c, d) {
                (b.has(a, c) ? a[c] : a[c] = []).push(d)
            })
        };
        b.countBy = function(a, c, d) {
            return H(a, c, d, function(a, c) {
                b.has(a, c) || (a[c] = 0);
                a[c]++
            })
        };
        b.sortedIndex = function(a, c, d, e) {
            for (var d = d == null ? b.identity : A(d), c = d.call(e, c), f = 0, i = a.length; f < i;) {
                var g = f + i >>> 1;
                d.call(e, a[g]) < c ? f = g + 1 : i = g
            }
            return f
        };
        b.toArray = function(a) {
            return !a ? [] : a.length === +a.length ? f.call(a) : b.values(a)
        };
        b.size = function(a) {
            return a.length === +a.length ? a.length : b.keys(a).length
        };
        b.first = b.head = b.take = function(a, c, b) {
            return c != null && !b ? f.call(a, 0, c) : a[0]
        };
        b.initial = function(a, c, b) {
            return f.call(a, 0, a.length - (c == null || b ? 1 : c))
        };
        b.last = function(a, c, b) {
            return c != null && !b ? f.call(a, Math.max(a.length - c, 0)) : a[a.length - 1]
        };
        b.rest = b.tail = b.drop = function(a, c, b) {
            return f.call(a, c == null || b ? 1 : c)
        };
        b.compact = function(a) {
            return b.filter(a, function(a) {
                return !!a
            })
        };
        var I = function(a, c, d) {
            m(a, function(a) {
                b.isArray(a) ? c ? k.apply(d, a) : I(a, c, d) : d.push(a)
            });
            return d
        };
        b.flatten = function(a, c) {
            return I(a, c, [])
        };
        b.without = function(a) {
            return b.difference(a, f.call(arguments, 1))
        };
        b.uniq = b.unique = function(a, c, d, e) {
            var d = d ? b.map(a, d, e) : a,
                f = [],
                i = [];
            m(d, function(d, e) {
                if (c ? !e || i[i.length - 1] !== d : !b.contains(i, d)) {
                    i.push(d);
                    f.push(a[e])
                }
            });
            return f
        };
        b.union = function() {
            return b.uniq(w.apply(g, arguments))
        };
        b.intersection = function(a) {
            var c = f.call(arguments, 1);
            return b.filter(b.uniq(a), function(a) {
                return b.every(c, function(c) {
                    return b.indexOf(c, a) >= 0
                })
            })
        };
        b.difference = function(a) {
            var c = w.apply(g, f.call(arguments, 1));
            return b.filter(a, function(a) {
                return !b.contains(c, a)
            })
        };
        b.zip = function() {
            for (var a = f.call(arguments), c = b.max(b.pluck(a, "length")), d = Array(c), e = 0; e < c; e++) d[e] = b.pluck(a, "" + e);
            return d
        };
        b.object = function(a, c) {
            for (var b = {}, e = 0, f = a.length; e < f; e++) c ? b[a[e]] = c[e] : b[a[e][0]] = a[e][1];
            return b
        };
        b.indexOf = function(a, c, d) {
            if (a == null) return -1;
            var e =
                0,
                f = a.length;
            if (d)
                if (typeof d == "number") e = d < 0 ? Math.max(0, f + d) : d;
                else {
                    e = b.sortedIndex(a, c);
                    return a[e] === c ? e : -1
                }
            if (h && a.indexOf === h) return a.indexOf(c, d);
            for (; e < f; e++)
                if (a[e] === c) return e;
            return -1
        };
        b.lastIndexOf = function(a, c, b) {
            if (a == null) return -1;
            var e = b != null;
            if (F && a.lastIndexOf === F) return e ? a.lastIndexOf(c, b) : a.lastIndexOf(c);
            for (b = e ? b : a.length; b--;)
                if (a[b] === c) return b;
            return -1
        };
        b.range = function(a, b, d) {
            if (arguments.length <= 1) {
                b = a || 0;
                a = 0
            }
            for (var d = arguments[2] || 1, e = Math.max(Math.ceil((b - a) / d), 0), f = 0, i = Array(e); f < e;) {
                i[f++] = a;
                a = a + d
            }
            return i
        };
        var J = function() {};
        b.bind = function(a, c) {
            var d, e;
            if (a.bind === z && z) return z.apply(a, f.call(arguments, 1));
            if (!b.isFunction(a)) throw new TypeError;
            e = f.call(arguments, 2);
            return d = function() {
                if (!(this instanceof d)) return a.apply(c, e.concat(f.call(arguments)));
                J.prototype = a.prototype;
                var b = new J,
                    i = a.apply(b, e.concat(f.call(arguments)));
                return Object(i) === i ? i : b
            }
        };
        b.bindAll = function(a) {
            var c = f.call(arguments, 1);
            c.length == 0 && (c = b.functions(a));
            m(c, function(c) {
                a[c] =
                    b.bind(a[c], a)
            });
            return a
        };
        b.memoize = function(a, c) {
            var d = {};
            c || (c = b.identity);
            return function() {
                var e = c.apply(this, arguments);
                return b.has(d, e) ? d[e] : d[e] = a.apply(this, arguments)
            }
        };
        b.delay = function(a, b) {
            var d = f.call(arguments, 2);
            return setTimeout(function() {
                return a.apply(null, d)
            }, b)
        };
        b.defer = function(a) {
            return b.delay.apply(b, [a, 1].concat(f.call(arguments, 1)))
        };
        b.throttle = function(a, c) {
            var d, e, f, i, g, h, j = b.debounce(function() {
                g = i = false
            }, c);
            return function() {
                d = this;
                e = arguments;
                f || (f = setTimeout(function() {
                    f =
                        null;
                    g && (h = a.apply(d, e));
                    j()
                }, c));
                if (i) g = true;
                else {
                    i = true;
                    h = a.apply(d, e)
                }
                j();
                return h
            }
        };
        b.debounce = function(a, b, d) {
            var e, f;
            return function() {
                var i = this,
                    g = arguments,
                    h = d && !e;
                clearTimeout(e);
                e = setTimeout(function() {
                    e = null;
                    d || (f = a.apply(i, g))
                }, b);
                h && (f = a.apply(i, g));
                return f
            }
        };
        b.once = function(a) {
            var b = false,
                d;
            return function() {
                if (b) return d;
                b = true;
                d = a.apply(this, arguments);
                a = null;
                return d
            }
        };
        b.wrap = function(a, b) {
            return function() {
                var d = [a];
                k.apply(d, arguments);
                return b.apply(this, d)
            }
        };
        b.compose = function() {
            var a =
                arguments;
            return function() {
                for (var b = arguments, d = a.length - 1; d >= 0; d--) b = [a[d].apply(this, b)];
                return b[0]
            }
        };
        b.after = function(a, b) {
            return a <= 0 ? b() : function() {
                if (--a < 1) return b.apply(this, arguments)
            }
        };
        b.keys = K ||
            function(a) {
                if (a !== Object(a)) throw new TypeError("Invalid object");
                var c = [],
                    d;
                for (d in a) b.has(a, d) && (c[c.length] = d);
                return c
        };
        b.values = function(a) {
            var c = [],
                d;
            for (d in a) b.has(a, d) && c.push(a[d]);
            return c
        };
        b.pairs = function(a) {
            var c = [],
                d;
            for (d in a) b.has(a, d) && c.push([d, a[d]]);
            return c
        };
        b.invert =

        function(a) {
            var c = {},
                d;
            for (d in a) b.has(a, d) && (c[a[d]] = d);
            return c
        };
        b.functions = b.methods = function(a) {
            var c = [],
                d;
            for (d in a) b.isFunction(a[d]) && c.push(d);
            return c.sort()
        };
        b.extend = function(a) {
            m(f.call(arguments, 1), function(b) {
                for (var d in b) a[d] = b[d]
            });
            return a
        };
        b.pick = function(a) {
            var b = {},
                d = w.apply(g, f.call(arguments, 1));
            m(d, function(d) {
                d in a && (b[d] = a[d])
            });
            return b
        };
        b.omit = function(a) {
            var c = {},
                d = w.apply(g, f.call(arguments, 1)),
                e;
            for (e in a) b.contains(d, e) || (c[e] = a[e]);
            return c
        };
        b.defaults = function(a) {
            m(f.call(arguments, 1), function(b) {
                for (var d in b) a[d] == null && (a[d] = b[d])
            });
            return a
        };
        b.clone = function(a) {
            return !b.isObject(a) ? a : b.isArray(a) ? a.slice() : b.extend({}, a)
        };
        b.tap = function(a, b) {
            b(a);
            return a
        };
        var B = function(a, c, d, e) {
            if (a === c) return a !== 0 || 1 / a == 1 / c;
            if (a == null || c == null) return a === c;
            if (a instanceof b) a = a._wrapped;
            if (c instanceof b) c = c._wrapped;
            var f = r.call(a);
            if (f != r.call(c)) return false;
            switch (f) {
                case "[object String]":
                    return a == "" + c;
                case "[object Number]":
                    return a != +a ? c != +c : a == 0 ? 1 / a == 1 / c : a == +c;
                case "[object Date]":
                case "[object Boolean]":
                    return +a == +c;
                case "[object RegExp]":
                    return a.source == c.source && a.global == c.global && a.multiline == c.multiline && a.ignoreCase == c.ignoreCase
            }
            if (typeof a != "object" || typeof c != "object") return false;
            for (var i = d.length; i--;)
                if (d[i] == a) return e[i] == c;
            d.push(a);
            e.push(c);
            var i = 0,
                g = true;
            if (f == "[object Array]") {
                i = a.length;
                if (g = i == c.length)
                    for (; i--;)
                        if (!(g = B(a[i], c[i], d, e))) break
            } else {
                var f = a.constructor,
                    h = c.constructor;
                if (f !== h && (!b.isFunction(f) || !(f instanceof f && b.isFunction(h) && h instanceof h))) return false;
                for (var j in a)
                    if (b.has(a, j)) {
                        i++;
                        if (!(g = b.has(c, j) && B(a[j], c[j], d, e))) break
                    }
                if (g) {
                    for (j in c)
                        if (b.has(c, j) && !i--) break;
                    g = !i
                }
            }
            d.pop();
            e.pop();
            return g
        };
        b.isEqual = function(a, b) {
            return B(a, b, [], [])
        };
        b.isEmpty = function(a) {
            if (a == null) return true;
            if (b.isArray(a) || b.isString(a)) return a.length === 0;
            for (var c in a)
                if (b.has(a, c)) return false;
            return true
        };
        b.isElement = function(a) {
            return !!(a && a.nodeType === 1)
        };
        b.isArray = o ||
            function(a) {
                return r.call(a) == "[object Array]"
        };
        b.isObject = function(a) {
            return a === Object(a)
        };
        m("Arguments Function String Number Date RegExp".split(" "), function(a) {
            b["is" + a] = function(b) {
                return r.call(b) == "[object " + a + "]"
            }
        });
        b.isArguments(arguments) || (b.isArguments = function(a) {
            return !(!a || !b.has(a, "callee"))
        });
        "function" !== typeof / . / && (b.isFunction = function(a) {
            return typeof a === "function"
        });
        b.isFinite = function(a) {
            return b.isNumber(a) && isFinite(a)
        };
        b.isNaN = function(a) {
            return b.isNumber(a) && a != +a
        };
        b.isBoolean = function(a) {
            return a === true || a === false || r.call(a) == "[object Boolean]"
        };
        b.isNull = function(a) {
            return a === null
        };
        b.isUndefined = function(a) {
            return a === void 0
        };
        b.has = function(a, b) {
            return y.call(a, b)
        };
        b.noConflict = function() {
            j._ = u;
            return this
        };
        b.identity = function(a) {
            return a
        };
        b.times = function(a, b, d) {
            for (var e = 0; e < a; e++) b.call(d, e)
        };
        b.random = function(a, b) {
            if (b == null) {
                b = a;
                a = 0
            }
            return a + (0 | Math.random() * (b - a + 1))
        };
        var x = {
            escape: {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "/": "&#x2F;"
            }
        };
        x.unescape = b.invert(x.escape);
        var L = {
            escape: RegExp("[" + b.keys(x.escape).join("") + "]", "g"),
            unescape: RegExp("(" + b.keys(x.unescape).join("|") + ")", "g")
        };
        b.each(["escape", "unescape"], function(a) {
            b[a] = function(b) {
                return b == null ? "" : ("" + b).replace(L[a], function(b) {
                    return x[a][b]
                })
            }
        });
        b.result = function(a, c) {
            if (a == null) return null;
            var d = a[c];
            return b.isFunction(d) ? d.call(a) : d
        };
        b.mixin = function(a) {
            m(b.functions(a), function(c) {
                var d = b[c] = a[c];
                b.prototype[c] = function() {
                    var a = [this._wrapped];
                    k.apply(a, arguments);
                    a = d.apply(b, a);
                    return this._chain ? b(a).chain() : a
                }
            })
        };
        var M = 0;
        b.uniqueId = function(a) {
            var b = M++;
            return a ? a + b : b
        };
        b.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var C = /(.)^/,
            N = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\t": "t",
                "\u2028": "u2028",
                "\u2029": "u2029"
            },
            O = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        b.template = function(a, c, d) {
            var d = b.defaults({}, d, b.templateSettings),
                e = RegExp([(d.escape || C).source, (d.interpolate || C).source, (d.evaluate || C).source].join("|") + "|$", "g"),
                f = 0,
                g = "__p+='";
            a.replace(e, function(b, c, d, e, h) {
                g = g + a.slice(f, h).replace(O, function(a) {
                    return "\\" + N[a]
                });
                g = g + (c ? "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'" : d ? "'+\n((__t=(" + d + "))==null?'':__t)+\n'" : e ? "';\n" + e + "\n__p+='" : "");
                f = h + b.length
            });
            g = g + "';\n";
            d.variable || (g = "with(obj||{}){\n" + g + "}\n");
            g = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + g + "return __p;\n";
            try {
                var h = new Function(d.variable || "obj", "_", g)
            } catch (j) {
                j.source = g;
                throw j;
            }
            if (c) return h(c, b);
            c = function(a) {
                return h.call(this, a, b)
            };
            c.source = "function(" + (d.variable || "obj") + "){\n" + g + "}";
            return c
        };
        b.chain = function(a) {
            return b(a).chain()
        };
        b.mixin(b);
        m("pop push reverse shift sort splice unshift".split(" "), function(a) {
            var c = g[a];
            b.prototype[a] = function() {
                var d = this._wrapped;
                c.apply(d, arguments);
                (a == "shift" || a == "splice") && d.length === 0 && delete d[0];
                return this._chain ? b(d).chain() : d
            }
        });
        m(["concat", "join", "slice"], function(a) {
            var c = g[a];
            b.prototype[a] = function() {
                var a = c.apply(this._wrapped, arguments);
                return this._chain ? b(a).chain() : a
            }
        });
        b.extend(b.prototype, {
            chain: function() {
                this._chain = true;
                return this
            },
            value: function() {
                return this._wrapped
            }
        })
    }).call(window);
});