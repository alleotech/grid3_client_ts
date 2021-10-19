"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZmountResult = exports.Zmount = void 0;
const class_validator_1 = require("class-validator");
// ssd mounts under zmachine
// ONLY possible on SSD
class Zmount {
    size; // bytes
    challenge() {
        return this.size;
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1)
], Zmount.prototype, "size", void 0);
exports.Zmount = Zmount;
class ZmountResult {
    volume_id;
}
exports.ZmountResult = ZmountResult;
