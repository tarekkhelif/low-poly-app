// @flow

import { ReduxTesselation, Point, Node, NodeId } from "../types/types";

import { MOVE } from "../../app/store/appActions";

function editTesselationStageReducer(
    state: ReduxTesselation = {},
    action: { type: string, payload: Object }
): ReduxTesselation {
    let returnValue;
    switch (action.type) {
        case MOVE: {
            const { id: actionId, dx, dy } = action.payload;

            const newNodes = { ...state.nodes };

            const [oldX, oldY] = state.nodes[actionId];
            newNodes[actionId] = [oldX + dx, oldY + dy];

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
