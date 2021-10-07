"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPv4 = void 0;
const workload_1 = require("../zos/workload");
const ipv4_1 = require("../zos/ipv4");
class IPv4 {
    create(name, metadata = "", description = "", version = 0) {
        const public_ip = new ipv4_1.PublicIP();
        const ipv4_workload = new workload_1.Workload();
        ipv4_workload.version = version;
        ipv4_workload.name = name;
        ipv4_workload.type = workload_1.WorkloadTypes.ipv4;
        ipv4_workload.data = public_ip;
        ipv4_workload.metadata = metadata;
        ipv4_workload.description = description;
        return ipv4_workload;
    }
    update(name, metadata = "", description = "", old_version = 1) {
        return this.create(name, metadata, description, old_version + 1);
    }
}
exports.IPv4 = IPv4;
