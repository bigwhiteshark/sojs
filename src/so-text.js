/**
 * Created by yangxinming on 14-6-23.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
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

	function globalEval(content) {
		if (content && /\S/.test(content)) {
			(global.execScript || function(content) {
				(global.eval || eval).call(global, content)
			})(content)
		}
	}

	/*sojs.on("request", function(data) {
		var name = uriCache[data.uri];

		if (name) {
			xhr(data.requestUri, function(content) {
				plugins[name].exec(data.uri, content)
				data.onRequest()
			})

			data.requested = true
		}
	})*/
})(this);