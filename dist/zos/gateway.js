"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayResult = exports.GatewayNameProxy = exports.GatewayFQDNProxy = void 0;
class GatewayFQDNProxy {
    challenge() {
        let out = "";
        out += this.fqdn;
        out += this.tls_passthrough.toString();
        for (let backend of this.backends) {
            out += backend;
        }
        return out;
    }
}
exports.GatewayFQDNProxy = GatewayFQDNProxy;
class GatewayNameProxy {
    challenge() {
        let out = "";
        out += this.name;
        out += this.tls_passthrough.toString();
        for (let backend of this.backends) {
            out += backend;
        }
        return out;
    }
}
exports.GatewayNameProxy = GatewayNameProxy;
class GatewayResult {
}
exports.GatewayResult = GatewayResult;