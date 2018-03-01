// @flow

import { ReduxTesselation, Node } from "../types/types";

import { MOVE_NODE } from "./tesselationActions";

function editTesselationStageReducer(
    state: ReduxTesselation = {},
    action: { type: string, payload: Object }
): ReduxTesselation {
    let returnValue;
    switch (action.type) {
        case MOVE_NODE: {
            const newNodes = state.nodes.map((node: Node): Node =>
                (node.id === action.payload.nodeId
                    ? { id: node.id, point: action.payload.newLocation }
                    : node));

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
