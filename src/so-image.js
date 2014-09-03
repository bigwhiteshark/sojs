/**
 * Created by yangxinming on 14-8-9.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
    var IS_IMG_RE = /\.jpg|jpeg|png|gif|bmp(?:\?|$)/i;

    function imageOnload(url, callback) {
        var elem = new Image();
        elemOnload(elem, callback, true);
        elem.src = url;
        return elem;
    }

    sojs.on('resolve', function(mod) {
        var id = mod.id,
            m, name;
        if ((m = id.match(/[^?]+(\.\w+)(?:\?|#|$)/))) {
            name = m[1];
        }
        if (name && IS_IMG_RE.test(name)) {
            id = id + '#';
            var pMod = mod.pMod;
            mod.uri = sojs.resolve(id, pMod && pMod.uri);
            mod.assetOnLoad = imageOnload;
        }
    })
})(this);