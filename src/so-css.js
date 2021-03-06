/**
 * Created by yangxinming on 14-8-2.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
    var UA = navigator.userAgent,
        IS_CSS_RE = /\.css(?:\?|$)/i,
        // `onload` event is supported in WebKit since 535.23
        // Ref:  - https://bugs.webkit.org/show_activity.cgi?id=38995
        isOldWebKit = Number(UA.replace(/.*AppleWebKit\/(\d+)\..*/, '$1')) < 536;

    function cssOnload(url, callback) {
        var elem = doc.createElement('link'),
            supportOnload = "onload" in elem,
            // `onload/onerror` event is supported since Firefox 9.0
            // Ref:
            //  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
            //  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
            isOldFirefox = UA.indexOf('Firefox') > 0 && !supportOnload;

        // for Old WebKit and Old Firefox
        if (isOldWebKit || isOldFirefox) {
            setTimeout(function() {
                poll(elem, callback)
            }, 1) // Begin after elem insertion
            return
        }
        elemOnload(elem, callback, true);
        elem.rel = "stylesheet";
        elem.href = url;
        return elem;
    }

    function poll(node, callback) {
        var sheet = node.sheet,
            isLoaded;

        if (isOldWebKit) { // for WebKit < 536
            if (sheet) {
                isLoaded = true
            }
        } else if (sheet) { // for Firefox < 9.0
            try {
                if (sheet.cssRules) {
                    isLoaded = true
                }
            } catch (ex) {
                // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
                // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
                // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
                if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                    isLoaded = true
                }
            }
        }

        setTimeout(function() {
            if (isLoaded) {
                // Place callback here to give time for style rendering
                callback()
            } else {
                poll(node, callback)
            }
        }, 1)
    }

    function styleOnload(cssText) {
        var elem = doc.createElement('style');
        elem.type = 'text/css';
        if (elem.styleSheet) { // IE
            if (doc.getElementsByTagName('style').length > 31) {
                throw new Error('Exceed the maximal count of style tags in IE')
            }
            elem.styleSheet.cssText += cssText
        } else {
            elem.appendChild(doc.createTextNode(cssText))
        }
        head.appendChild(elem);
    }

    var cssTexts = {};
    sojs.on('identify', function(opts) {
        var id = opts.id;
        if (IS_CSS_TEXT_RE.test(id)) {
            var cssText = id,
                id = SYNC_ID + guid() + '.css';
            forEach(cssTexts, function(v, key) {
                if (v === cssText) {
                    id = key;
                    return false;
                }
            });
            cssTexts[id] = cssText;
            opts.id = id;
        }
    })

    sojs.on('resolve', function(mod) {
        var id = mod.id,
            m, name;
        if ((m = id.match(/[^?]+(\.\w+)(?:\?|#|$)/))) {
            name = m[1];
        }
        if (name && IS_CSS_RE.test(name)) {
            var cssText = cssTexts[id];
            id = id + '#';
            mod.uri = sojs.resolve(id);
            if (cssText) {
                styleOnload(cssText);
            } else {
                mod.assetOnLoad = cssOnload;
            }
        }
    })
})(this);