var _ = require("lodash");
var LRUCache = require("simple-lru-cache");

var cache = undefined;

function setLimit(limit) {
    delete cache;

    if (limit > 0) cache = new LRUCache({"maxSize": limit });
}


function cacheNamespace( namespace) {
    var _key = function(key) {
        return namespace+":"+key;
    }

    return {
        get: function(key) {
            if (!cache) return undefined;
            return cache.get(_key(key));
        },
        set: function(key, value) {
            if (!cache) return undefined;
            return cache.set(_key(key), value);
        }
    }
}


module.exports = cacheNamespace;
module.exports.setLimit = setLimit;
