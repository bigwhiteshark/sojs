/**
 * Created by yangxinming on 14-6-23.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
	var plugins = {};

	function register(o) {
		plugins[o.name] = o
	}

	register({
		name: "text",
		ext: [".tpl", ".html"],
		exec: function(content) {
			return jsEscape(content)
		}
	})

	register({
		name: "json",
		ext: [".json"],
		exec: function(content) {
			return content
		}
	})

	function isPlugin(name) {
		return name && plugins.hasOwnProperty(name)
	}

	function getPluginName(ext) {
		for (var k in plugins) {
			if (isPlugin(k)) {
				var exts = "," + plugins[k].ext.join(",") + ","
				if (exts.indexOf("," + ext + ",") > -1) {
					return k
				}
			}
		}
	}

	function xhr(url, callback) {
		var r = global.ActiveXObject ?
			new global.ActiveXObject("Microsoft.XMLHTTP") :
			new global.XMLHttpRequest()
		r.open("GET", url, true)
		r.onreadystatechange = function() {
			if (r.readyState === 4) {
				// Support local file
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

	sojs.on("request", function(mod) {
		var uri = mod.uri,
			m = uri.match(/[^?]+(\.\w+)(?:\?|#|$)/);
		if (!m) return;
		var name = getPluginName(m[1]);
		if (name) {
			xhr(mod.uri, function(content) {
				var content = plugins[name].exec(content)
				sojs.getDef(content, mod.uri)
			})
			mod.requested = true
		}
	})
})(this);