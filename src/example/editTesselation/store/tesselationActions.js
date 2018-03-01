// @flow

import { NodeId, Point } from "../types/types";

export const MOVE_NODE = "MOVE_NODE";

export function moveNodeAction(nodeId: NodeId, newLocation: Point) {
    return { type: MOVE_NODE, payload: { nodeId, newLocation } };
}
