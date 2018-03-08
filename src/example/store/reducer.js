// @flow

import {
    SET_EDITING_OUTLINE,
    ADD,
    DELETE,
    MOVE,
    KILL,
    ADD_POLYGON,
    MESH_POLY,
    nodeGroups
} from "./actions";

import { nodesReducer } from "./nodesReducer";

const polygonsReducer = (state, action) => {
    switch (action.type) {
        case ADD_POLYGON: {
            const { id, polygon } = action.payload;

            const nextState = { ...state };
            nextState[id] = polygon;
            return nextState;
        }
        default:
            return state;
    }
};

const defaultState = { editingOutline: false, active: true };
// $FlowFixMe
nodeGroups.forEach((group) => { defaultState[group] = {}; });

export const appReducer = (state: Object = defaultState, action: Object) => {
    if (action.type === SET_EDITING_OUTLINE) {
        const { editingOutline } = action.payload;

        const nextState = { ...state };
        nextState.editingOutline = editingOutline;
        return nextState;
    } else if (action.type === ADD ||
        action.type === DELETE ||
        action.type === MOVE) {
        const { nodeGroup } = action.payload;

        const nextState = { ...state };
        nextState[nodeGroup] = nodesReducer(state[nodeGroup], action);
        return nextState;
    } else if (action.type === ADD_POLYGON) {
        const nextState = { ...state };
        nextState[MESH_POLY] = polygonsReducer(state[MESH_POLY], action);
        return nextState;
    } else if (action.type === KILL) {
        const nextState = { ...state };
        nextState.active = false;
        return nextState;
    }

    return state;
};
