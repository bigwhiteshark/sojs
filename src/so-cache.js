/**
 * Created by yangxinming on 14-8-3.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
    var storagePrefix = 'sojs-',
        defaultExpiration = sojs.opts.expiration || 5000 * 60 * 60 * 1000,
        storage = sojs.opts.storage || global.localStorage;

    function wrapData(obj) {
        var now = +new Date();
        obj.stamp = now;
        obj.expire = now + (obj.expire || defaultExpiration);
        return obj;
    }

    var cache = {
        remove: function(key) {
            storage.removeItem(key);
            return this;
        },

        get: function(key) {
            var item = storage.getItem(key);
            try {
                return JSON.parse(item || 'false');
            } catch (e) {
                return false;
            }
        },

        clear: function(expired) {
            var key,
                now = +new Date();
            for (key in storage) {
                if (key && (!expired || this.get(key).expire <= now)) {
                    this.remove(key);
                }
            }

            return this;
        }
    }

    function addLocalStorage(key, storeObj) {
        try {
            storage.setItem(key, JSON.stringify(storeObj));
            return true;
        } catch (e) {
            //On the iPhone/ipod sometimes setItem will appear QUOTA_EXCEEDED_ERR errors,
            //then the general before setItem first removeItem to ok
            if (e.name.toUpperCase().indexOf('QUOTA') >= 0) {
                var item, tempScripts = [];

                for (item in storage) {
                    if (item.indexOf(storagePrefix) === 0) {
                        tempScripts.push(JSON.parse(storage[item]));
                    }
                }

                if (tempScripts.length) {
                    tempScripts.sort(function(a, b) {
                        return a.stamp - b.stamp;
                    });
                    cache.remove(tempScripts[0].key);
                    return addLocalStorage(key, storeObj);

                } else { // no files to remove. Larger than available quota
                    return;
                }

            } else { // some other error
                return;
            }
        }
    };

    cache.clear(true); //delete expired item

    sojs.on('resolve', function(mod) {
        var id = mod.id,
            m, name,
            key = storagePrefix + id;
        if (id.indexOf('sync') == -1) {
            if (!cache.get(key)) {
                mod.once('exec', function() {
                    //console.log(mod.factory);
                    var f = mod.factory;
                    f = typeof(f) === 'function' ? f + '' : f;
                    var storeData = {
                        factory: f
                    }
                    storeData = wrapData(storeData);
                    addLocalStorage(key, storeData);
                })
            }
        }
    })

    sojs.on("request", function(mod) {
        var id = mod.id,
            key = storagePrefix + id,
            storeData = cache.get(key);
        if (storeData) {
            mod.requested = true;
            var factory = storeData.factory;
            if (/^function/img.test(factory)) {
                factory = /\{((.|[\r\n\t\s])*)\}$/img.exec(factory)[0];
                factory = new Function('require,exports,module', factory);
            }
            mod.onDefine(factory)
        }

    })
})(this);