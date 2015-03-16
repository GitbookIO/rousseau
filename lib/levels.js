var LEVELS = {
    SUGGESTION: "suggestion",
    WARNING: "warning",
    ERROR: "error",
    CRITICAL: "critical"
};

var ORDER = [
    LEVELS.SUGGESTION,
    LEVELS.WARNING,
    LEVELS.ERROR,
    LEVELS.CRITICAL
];

function levelOrder(lvl) {
    return ORDER.indexOf(lvl);
}

module.exports = LEVELS;
module.exports.order = levelOrder;