/**
 * Created by yangxinming on 14-8-3.
 * https://github.com/bigwhiteshark/sojs
 * author:bigwhiteshark
 * blog:http://bigwhiteshark.github.io/blog/
 */
(function(global) {
    //only cache js file.
    var storagePrefix = 'sojs-',
        defaultExpiration = 5000 * 60 * 60 * 1000, //ms unit
        storage = global.localStorage;

    function wrapData(obj) {
        var now = +new Date();
        obj.stamp = now;
        obj.expire = now + (obj.expire || defaultExpiration);
        return obj;
    }
    if (storage) {
        var cache = {
            add: function(key, storeObj) {
                try {
                    storage.setItem(key, JSON.stringify(storeObj));
                    return true;
                } catch (e) {
                    //sometimes setItem will appear QUOTA_EXCEEDED_ERR errors,
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
                            return cache.add(key, storeObj);
                        } else { // no files to remove. Larger than available quota
                            return;
                        }
                    } else { // some other error
                        return;
                    }
                }
            },

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
        };

        cache.clear(true); //delete expired item

        sojs.on('config', function(opts) {
            var cacheVersion = opts.cacheVersion || 0,
                defaultExpiration = opts.expiration || defaultExpiration,
                key = storagePrefix + 'cache',
                storeData = cache.get(key);
            var localVersion = storeData ? storeData.version : 0;
            if (localVersion < cacheVersion) {
                cache.clear();
                storeData = wrapData({
                    version: cacheVersion
                });
                cache.add(key, storeData);
            }
        });

        sojs.on('resolve', function(mod) {
            var id = mod.uri,
                m, name,
                key = storagePrefix + id;
            if (id.indexOf('sync') == -1) {
                if (!cache.get(key)) {
                    mod.one('exec', function() {
                        var f = mod.factory;
                        f = typeof(f) === 'function' ? f + '' : f;
                        var storeData = {
                            factory: f
                        };
                        storeData = wrapData(storeData);
                        cache.add(key, storeData);
                    })
                }
            }
        })

        sojs.on("request", function(mod) {
            var id = mod.uri,
                key = storagePrefix + id,
                storeData = cache.get(key);
            if (storeData) {
                mod.requested = true;
                var factory = storeData.factory;
                if (/^function/img.test(factory)) { // if factory is function
                    var args = /\((.*)\)/mg.exec(factory)[1]; //get factory arguments
                    factory = /\{((.|[\r\n\t\s])*)\}$/img.exec(factory)[1]; //get factory body
                    factory = new Function(args, factory);
                }
                mod.onDefine(factory);
            }
        })
    }
})(this);