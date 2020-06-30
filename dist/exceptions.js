"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedOperation = exports.UnauthorizedWriteOperation = exports.UnauthorizedReadOperation = void 0;
var UnauthorizedReadOperation = /** @class */ (function (_super) {
    __extends(UnauthorizedReadOperation, _super);
    function UnauthorizedReadOperation() {
        return _super.call(this, 'Unauthorized read operation request') || this;
    }
    return UnauthorizedReadOperation;
}(Error));
exports.UnauthorizedReadOperation = UnauthorizedReadOperation;
var UnauthorizedWriteOperation = /** @class */ (function (_super) {
    __extends(UnauthorizedWriteOperation, _super);
    function UnauthorizedWriteOperation() {
        return _super.call(this, 'Unauthorized write operation request') || this;
    }
    return UnauthorizedWriteOperation;
}(Error));
exports.UnauthorizedWriteOperation = UnauthorizedWriteOperation;
var UnauthorizedOperation = /** @class */ (function (_super) {
    __extends(UnauthorizedOperation, _super);
    function UnauthorizedOperation() {
        return _super.call(this, 'Unauthorized operation request') || this;
    }
    return UnauthorizedOperation;
}(Error));
exports.UnauthorizedOperation = UnauthorizedOperation;
