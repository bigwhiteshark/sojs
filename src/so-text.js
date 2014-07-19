/**
 * Created by yangxinming on 14-6-23.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
    var plugins = {
        '.tpl,.html,text': function(content) {
            return jsEscape(content)
        },
        '.json': function(content) {
            return content
        }
    }

    function xhr(url, callback) {
        var r = global.XMLHttpRequest ?
            new global.XMLHttpRequest() :
            new global.ActiveXObject("Microsoft.XMLHTTP")
        r.open("GET", url, true)
        r.onreadystatechange = function() {
            if (r.readyState === 4) {
                if (r.status > 399 && r.status < 600) {
                    throw new Error("Could not load: " + url + ", status = " + r.status)
                } else {
                    callback(r.responseText)
                }
            }
        }
        return r.send(null)
    }

    function jsEscape(content) {
        return content.replace(/(["\\])/g, "\\$1")
            .replace(/[\f]/g, "\\f")
            .replace(/[\b]/g, "\\b")
            .replace(/[\n]/g, "\\n")
            .replace(/[\t]/g, "\\t")
            .replace(/[\r]/g, "\\r")
            .replace(/[\u2028]/g, "\\u2028")
            .replace(/[\u2029]/g, "\\u2029")
    }

    function getPluginExec(name) {
        var exec;
        if (name) {
            for (var k in plugins) {
                var exts = "," + k + ",";
                if (exts.indexOf("," + name + ",") > -1) {
                    exec = plugins[k];
                    break;
                }
            }
        }
        return exec
    }

    sojs.on('resolve', function(mod) {
        var id = mod.id,
            m, name;
        if ((m = id.match(/^(\w+)!(.+)$/))) {
            name = m[1];
            id = m[2];
        } else if ((m = id.match(/[^?]+(\.\w+)(?:\?|#|$)/))) {
            name = m[1];
        }
        if(name){
            id = id + '#';
            mod.uri = sojs.resolve(id);
            mod.exec = getPluginExec(name);
        }
    })

    sojs.on("request", function(mod) {
        var exec = mod.exec;
        if (exec) {
            mod.requested = true;
            xhr(mod.uri, function(content) {
                var factory = exec(content);
                mod.onDefine(factory)
            })
        }
    })
})(this);