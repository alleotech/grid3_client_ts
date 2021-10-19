import { IsString, IsNotEmpty, IsDefined, IsInt, Min, ValidateNested } from "class-validator";

import { Znet } from "./znet";
import { Zmount, ZmountResult } from "./zmount";
import { Zmachine, ZmachineResult } from "./zmachine";
import { Zdb, ZdbResult } from "./zdb";
import { PublicIP } from "./ipv4";
import { GatewayFQDNProxy, GatewayNameProxy, GatewayResult } from "./gateway";
import { QuantumSafeFS } from "./qsfs";

enum ResultStates {
    error = "error",
    ok = "ok",
    deleted = "deleted",
}

enum WorkloadTypes {
    zmachine = "zmachine",
    zmount = "zmount",
    network = "network",
    zdb = "zdb",
    ipv4 = "ipv4",
    gatewayfqdnproxy = "gateway-fqdn-proxy",
    gatewaynameproxy = "gateway-name-proxy",
    qsfs = "qsfs",
}

enum Right {
    restart,
    delete,
    stats,
    logs,
}

// Access Control Entry
class ACE {
    // the administrator twin id
    twin_ids: number[];
    rights: Right[];
}

class DeploymentResult {
    created: number;
    state: ResultStates;
    error = "";
    data = ""; // also json.RawMessage
}

class Workload {
    @IsInt() @Min(0) version: number;
    // unique name per Deployment
    @IsString() @IsNotEmpty() name: string;
    type: WorkloadTypes;
    // this should be something like json.RawMessage in golang
    @ValidateNested() data:
        | Zmount
        | Znet
        | Zmachine
        | Zdb
        | PublicIP
        | GatewayFQDNProxy
        | GatewayNameProxy
        | QuantumSafeFS; // serialize({size: 10}) ---> "data": {size:10},

    @IsString() @IsDefined() metadata: string;
    @IsString() @IsDefined() description: string;

    // list of Access Control Entries
    // what can an administrator do
    // not implemented in zos
    // acl []ACE

    result: DeploymentResult;

    challenge() {
        let out = "";
        out += this.version;
        out += this.type.toString();
        out += this.metadata;
        out += this.description;
        out += this.data.challenge();

        return out;
    }
}

type WorkloadData = Zmount | Zdb | Zmachine | Znet | GatewayFQDNProxy | GatewayNameProxy;
type WorkloadDataResult = ZmountResult | ZdbResult | ZmachineResult | GatewayResult;

// pub fn(mut w WorkloadData) challenge() string {
// 	return w.challenge()
// }

export { Workload, WorkloadTypes, WorkloadData, WorkloadDataResult };
