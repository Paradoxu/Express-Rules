"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRule = void 0;
var jsonschema_1 = require("jsonschema");
var RequestRule = /** @class */ (function () {
    function RequestRule(request) {
        var _this = this;
        this.readTypes = ['GET', 'HEAD', 'OPTIONS'];
        this.writeTypes = ['POST', 'PUT', 'DELETE'];
        this.contentLength = function () { return JSON.stringify(_this.originalRequest.body).length; };
        /**
         * Get the original request retrieved from express
         */
        this.original = function () { return _this.originalRequest; };
        /**
         * True if the content of the body is lower or equal than the given length
         */
        this.maxLength = function (length) { return _this.contentLength() <= length; };
        /**
         * True if the content of the body is higher or equal than the given length
         */
        this.minLength = function (length) { return _this.contentLength() >= length; };
        /**
         * True if the given properties exists on the body of the original request
         *
         * The body of the request must be in the format of x-www-form-urlencoded
         */
        this.hasProps = function (properties) {
            if (Array.isArray(properties)) {
                return properties.every(function (prop) { return _this.originalRequest.body[prop] !== undefined; });
            }
            else {
                return _this.originalRequest.body[properties] !== undefined;
            }
        };
        /**
         * True if the original request is a Get, Head or Options
         */
        this.isRead = function () { return _this.readTypes.includes(_this.original().method); };
        /**
         * True if the original request is a Post, Put or Delete
         */
        this.isWrite = function () { return _this.writeTypes.includes(_this.original().method); };
        /**
         * Validate the body with the given schema, the validation will be made using the jsonschema package,
         *
         * @tutorial https://www.npmjs.com/package/jsonschema
         */
        this.validSchema = function (schema) { return jsonschema_1.validate(_this.original().body, schema).valid; };
        this.originalRequest = request;
    }
    return RequestRule;
}());
exports.RequestRule = RequestRule;
