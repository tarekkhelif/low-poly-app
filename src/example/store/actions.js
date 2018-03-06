// @flow

import { IncrementalId } from "../util/id";

export const ADD = "ADD";
export const DELETE = "DELETE";
export const MOVE = "MOVE";
export const KILL = "KILL";

export const ADD_POLYGON = "ADD_POLYGON";

export const OUTLINE = "outline";
export const SEED = "seed";
export const MESH_NODE = "meshNode";
export const MESH_POLY = "meshPoly";
export const nodeGroups = [
    OUTLINE,
    SEED,
    MESH_NODE];

const IDers = {};
IDers[OUTLINE] = new IncrementalId(OUTLINE);
IDers[SEED] = new IncrementalId(SEED);
IDers[MESH_NODE] = new IncrementalId(MESH_NODE);
IDers[MESH_POLY] = new IncrementalId(MESH_POLY);

export function addNodesAction(nodeGroup: string, ...points: number[][]) {
    const nodes = {};
    points.forEach((point) => {
        const id = IDers[nodeGroup].newId();
        nodes[id] = { point };
    });

    return { type: ADD, payload: { nodeGroup, nodes } };
}

export function deleteNodesAction(nodeGroup: string, ...ids: string[]) {
    return { type: DELETE, payload: { nodeGroup, ids } };
}

export function moveNodeAction(
    nodeGroup: string,
    id: string,
    newPoint: number[]
) {
    return { type: MOVE, payload: { nodeGroup, id, newPoint } };
}

export function killStageAction() {
    return { type: KILL };
}

export function addPolygonAction(nodeIds: string[], color: string) {
    const id = IDers[MESH_POLY].newId();
    const polygon = { nodeIds, color };

    return { type: ADD_POLYGON, payload: { id, polygon } };
}
