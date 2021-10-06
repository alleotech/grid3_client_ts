import { default as IP } from "ip";
import { default as isPrivateIP } from "private-ip";
import { TFClient } from "../tf-grid/client";
import { send } from "../helpers/requests";
const graphqlURL = "https://tfchain.dev.threefold.io/graphql/graphql";
async function getNodeTwinId(node_id) {
    const headers = { "Content-Type": "application/json" };
    const body = `{
            nodes(where: { nodeId_eq: ${node_id} }) {
            twinId
            }
        }`;
    const response = await send("post", graphqlURL, JSON.stringify({ query: body }), headers);
    return response["data"]["nodes"][0]["twinId"];
}
async function getAccessNodes() {
    const headers = { "Content-Type": "application/json" };
    let body = `{
        nodes {
          nodeId
          publicConfigId 
        }
      }`;
    const nodeResponse = await send("post", graphqlURL, JSON.stringify({ query: body }), headers);
    const nodes = nodeResponse["data"]["nodes"];
    const nodeConfigs = {};
    let configsIds = "";
    for (const node of nodes) {
        if (!node.publicConfigId) {
            continue;
        }
        nodeConfigs[node.nodeId] = node.publicConfigId;
        configsIds += `"${node.publicConfigId}", `;
    }
    body = `{
        publicConfigs (where: {id_in: [${configsIds}]}) {
          id
          ipv4
          ipv6
          domain
        }
      }`;
    const pubConfigResponse = await send("post", graphqlURL, JSON.stringify({ query: body }), headers);
    const configs = pubConfigResponse["data"]["publicConfigs"];
    const accessNodes = {};
    for (const nodeId of Object.keys(nodeConfigs)) {
        const config = nodeConfigs[nodeId];
        for (const conf of configs) {
            if (config === conf["id"]) {
                const ipv4 = conf["ipv4"];
                const ipv6 = conf["ipv6"];
                if ((IP.isV4Format(ipv4.split("/")[0]) && !isPrivateIP(ipv4)) ||
                    (IP.isV6Format(ipv6.split("/")[0]) && !isPrivateIP(ipv6))) {
                    accessNodes[nodeId] = { ipv4: ipv4, ipv6: ipv6 };
                }
            }
        }
    }
    console.log(accessNodes);
    return accessNodes;
}
async function getNodeIdFromContractId(contractId, url, mnemonic) {
    const tfclient = new TFClient(url, mnemonic);
    await tfclient.connect();
    let nodeId;
    try {
        const contract = await tfclient.contracts.get(contractId);
        nodeId = contract["contract_type"]["nodeContract"]["node_id"];
    }
    catch (err) {
        throw Error(err);
    }
    finally {
        tfclient.disconnect();
    }
    return nodeId;
}
export { getNodeTwinId, getAccessNodes, getNodeIdFromContractId };
