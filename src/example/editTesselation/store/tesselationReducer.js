// @flow

import { ReduxTesselation, Point, Node, NodeId } from "../types/types";

import { MOVE_NODE } from "./tesselationActions";

function editTesselationStageReducer(
    state: ReduxTesselation = {},
    action: { type: string, payload: Object }
): ReduxTesselation {
    let returnValue;
    switch (action.type) {
        case MOVE_NODE: {
            const actionId = action.payload.nodeId;
            const actionPoint = action.payload.newLocation;

            const newNodes = {};
            const nodesArray = Object.entries(state.nodes);
            nodesArray.forEach((entry): Node => {
                const id: NodeId = entry[0];
                const node: Node = entry[1];
                const oldPoint: Point = node.point;
                const newPoint: Point =
                    id === actionId ? actionPoint : oldPoint;
                newNodes[id] = newPoint;
            });

            returnValue = { ...state, nodes: newNodes };
            break;
        }
        default: {
            returnValue = state;
        }
    }
    return returnValue;
}

export { editTesselationStageReducer };
