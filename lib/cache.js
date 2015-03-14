var _ = require("lodash");
var LRUCache = require("simple-lru-cache");

var lru = undefined;

function setLimit(limit) {
    delete lru;
    if (limit > 0) lru = new LRUCache({"maxSize": limit });
}

function cacheNamespace(cache, namespace) {
    cache = cache || lru;

    var _key = function(key) {
        return namespace+":"+key;
    }

    var _cache = {
        get: function(key) {
            if (!cache) return undefined;
            return cache.get(_key(key));
        },
        set: function(key, value) {
            if (!cache) return undefined;
            return cache.set(_key(key), value);
        },

        // Change namespacing
        rename: function(name) {
            namespace = name;
        },

        // Return a sub-namespace
        namespace: function(name) {
            return cacheNamespace(_cache, name);
        },

        // Set limit
        setLimit: setLimit
    };

    return _cache;
}


module.exports = cacheNamespace("");
