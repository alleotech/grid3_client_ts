var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IsString, IsNotEmpty, IsIP, IsBoolean, IsInt, Min, ValidateNested } from "class-validator";
class ZNetworkInterface {
}
__decorate([
    IsString(),
    IsNotEmpty()
], ZNetworkInterface.prototype, "network", void 0);
__decorate([
    IsIP(),
    IsNotEmpty()
], ZNetworkInterface.prototype, "ip", void 0);
class ZmachineNetwork {
    challenge() {
        let out = "";
        out += this.public_ip;
        out += this.planetary.toString();
        for (let i = 0; i < this.interfaces.length; i++) {
            out += this.interfaces[i].network;
            out += this.interfaces[i].ip;
        }
        return out;
    }
}
__decorate([
    IsString(),
    IsNotEmpty()
], ZmachineNetwork.prototype, "public_ip", void 0);
__decorate([
    ValidateNested({ each: true })
], ZmachineNetwork.prototype, "interfaces", void 0);
__decorate([
    IsBoolean()
], ZmachineNetwork.prototype, "planetary", void 0);
class Mount {
    challenge() {
        let out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    }
}
__decorate([
    IsString(),
    IsNotEmpty()
], Mount.prototype, "name", void 0);
__decorate([
    IsString(),
    IsNotEmpty()
], Mount.prototype, "mountpoint", void 0);
class Zmachine {
    challenge() {
        let out = "";
        out += this.flist;
        out += this.network.challenge();
        out += this.size || "";
        out += this.compute_capacity.challenge();
        for (let i = 0; i < this.mounts.length; i++) {
            out += this.mounts[i].challenge();
        }
        out += this.entrypoint;
        for (const key of Object.keys(this.env).sort()) {
            out += key;
            out += "=";
            out += this.env[key];
        }
        return out;
    }
}
__decorate([
    IsString(),
    IsNotEmpty()
], Zmachine.prototype, "flist", void 0);
__decorate([
    ValidateNested()
], Zmachine.prototype, "network", void 0);
__decorate([
    IsInt(),
    Min(1024 * 1024 * 250)
], Zmachine.prototype, "size", void 0);
__decorate([
    ValidateNested()
], Zmachine.prototype, "compute_capacity", void 0);
__decorate([
    ValidateNested({ each: true })
], Zmachine.prototype, "mounts", void 0);
__decorate([
    IsString(),
    IsNotEmpty()
], Zmachine.prototype, "entrypoint", void 0);
// response of the deployment
class ZmachineResult {
    constructor() {
        // name unique per deployment, re-used in request & response
        this.id = "";
        this.ip = "";
    }
}
export { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount, ZmachineResult };
