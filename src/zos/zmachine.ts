import { IsString, IsNotEmpty, IsIP, IsBoolean, IsInt, Min, ValidateNested, IsDefined } from "class-validator";
import { Expose, Type } from "class-transformer";

import { ComputeCapacity } from "./computecapacity";
import { WorkloadData, WorkloadDataResult } from "./workload_base";

class ZNetworkInterface {
    @Expose() @IsString() @IsNotEmpty() network: string;
    @Expose() @IsIP() @IsNotEmpty() ip: string;
}

class ZmachineNetwork {
    @Expose() @IsString() @IsDefined() public_ip: string;
    @Expose() @Type(() => ZNetworkInterface) @ValidateNested({ each: true }) interfaces: ZNetworkInterface[];
    @Expose() @IsBoolean() planetary: boolean;

    challenge(): string {
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

class Mount {
    @Expose() @IsString() @IsNotEmpty() name: string;
    @Expose() @IsString() @IsNotEmpty() mountpoint: string;

    challenge(): string {
        let out = "";
        out += this.name;
        out += this.mountpoint;
        return out;
    }
}

class Zmachine extends WorkloadData {
    @Expose() @IsString() @IsNotEmpty() flist: string;
    @Expose() @Type(() => ZmachineNetwork) @ValidateNested() network: ZmachineNetwork;
    @Expose() @IsInt() @Min(1024 * 1024 * 250) size: number; // in bytes
    @Expose() @Type(() => ComputeCapacity) @ValidateNested() compute_capacity: ComputeCapacity;
    @Expose() @Type(() => Mount) @ValidateNested({ each: true }) mounts: Mount[];
    @Expose() @IsString() @IsNotEmpty() entrypoint: string;
    @Expose() env: Record<string, unknown>;

    challenge(): string {
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

class ZmachineResult extends WorkloadDataResult {
    @Expose() id: string;
    @Expose() ip: string;
    @Expose() ygg_ip: string;
}

export { Zmachine, ZmachineNetwork, ZNetworkInterface, Mount, ZmachineResult };
