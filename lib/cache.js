var _ = require("lodash");
var LRUCache = require("simple-lru-cache");

var lru = undefined;
var cacheSize = 0;

function setLimit(limit) {
    if (limit == cacheSize) return;
    delete lru;
    cacheSize = limit;
    if (limit > 0) lru = new LRUCache({ "maxSize": limit });
    else lru = null;
}

function cacheNamespace(namespace) {
    var _key = function(key) {
        return namespace+":"+key;
    }

    var _cache = {
        get: function(key) {
            if (!lru) return undefined;
            var val = lru.get(_key(key));
            return val? JSON.parse(val) : undefined;
        },
        set: function(key, value) {
            if (!lru) return undefined;
            return lru.set(_key(key), JSON.stringify(value));
        },

        // Change namespacing
        rename: function(name) {
            namespace = name;
        },

        // Return a sub-namespace
        namespace: function(name) {
            return cacheNamespace(namespace+":"+name);
        },

        // Set limit
        setLimit: setLimit
    };

    return _cache;
}


module.exports = cacheNamespace("");
