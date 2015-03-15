var LEVELS = {
    SUGGESTION: "suggestion",
    WARNING: "warn",
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