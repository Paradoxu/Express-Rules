"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressRules = void 0;
var exceptions_1 = require("./exceptions");
var request_rule_1 = require("./request_rule");
var ExpressRules = /** @class */ (function () {
    function ExpressRules() {
        var _this = this;
        this.rules = {};
        /**
         * Split the given url into an array of paths, ex:
         *
         * /test/route/child will return ['test', 'route', 'child']
         */
        this.paths = function (url) { var _a; return (_a = url.substring(1).split('/')) !== null && _a !== void 0 ? _a : []; };
        /**
         * Handle a given rule and throw a new Error if one of the handlers of the rule rejects the request
         */
        this.validateRule = function (rule, reqRuler, levelValue) {
            console.log(rule);
            if (rule.allowAllIf && !rule.allowAllIf(levelValue, reqRuler)) {
                throw new exceptions_1.UnauthorizedOperation();
            }
            else if (rule.allowReadIf && reqRuler.isRead() && !rule.allowReadIf(levelValue, reqRuler)) {
                throw new exceptions_1.UnauthorizedWriteOperation();
            }
            else if (rule.allowWriteIf && reqRuler.isWrite() && !rule.allowWriteIf(levelValue, reqRuler)) {
                throw new exceptions_1.UnauthorizedWriteOperation();
            }
            return true;
        };
        /**
         * Get the rule for a given level
         * @param oPath - The original path, for matching placeholder parameters
         * @param rPath - The replaced path, for matching specific situations
         * @param currentRule - The current rule found by the previous level
         * @returns The found rule for the given path, or null if it doesn't exist
         */
        this.getLevelRule = function (oPath, rPath, currentRule) {
            var _a, _b;
            if (currentRule === void 0) { currentRule = null; }
            var rules = currentRule === null ? ((_a = _this.rules.routes) !== null && _a !== void 0 ? _a : {}) : ((_b = currentRule.routes) !== null && _b !== void 0 ? _b : {});
            if (rules[rPath])
                return {
                    rule: rules[rPath],
                    path: rPath
                };
            else if (rules[oPath])
                return {
                    rule: rules[oPath],
                    path: oPath
                };
            return {
                rule: null,
                path: oPath
            };
        };
        /**
         * A ruler that will handle the request and only pass to the next middleware if the current route request is allowed
         */
        this.ruler = function (req, _res, next) {
            var _a;
            var oPaths = _this.paths(req.route.path);
            var rPaths = _this.paths(req.originalUrl);
            var requestRule = new request_rule_1.RequestRule(req);
            var index = 0;
            var levelRule = _this.getLevelRule(oPaths[index], rPaths[index], null);
            /**
             * Check if there is any global rule the global object,
             * ignore rules setted inside of the given exclude array
             */
            if (_this.rules.global && !((_a = _this.rules.exclude) === null || _a === void 0 ? void 0 : _a.includes(levelRule.path))) {
                _this.validateRule(_this.rules.global, requestRule, 'global');
            }
            while (levelRule.rule !== null &&
                _this.validateRule(levelRule.rule, requestRule, levelRule.path) &&
                index < oPaths.length) {
                index++;
                levelRule = _this.getLevelRule(oPaths[index], rPaths[index], levelRule.rule);
            }
            next();
        };
        /**
         * Configure the rules to be applied when the ruler handle is called
         */
        this.configure = function (rules) { return _this.rules = rules; };
    }
    return ExpressRules;
}());
exports.ExpressRules = ExpressRules;
