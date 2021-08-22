declare class Peer {
    subnet: string;
    wireguard_public_key: string;
    allowed_ips: string[];
    endpoint: string;
    challenge(): string;
}
declare class Znet {
    subnet: string;
    ip_range: string;
    wireguard_private_key: string;
    wireguard_listen_port: number;
    peers: Peer[];
    challenge(): string;
}
export { Znet, Peer };