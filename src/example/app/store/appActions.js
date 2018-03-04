// @flow

export const SET_TESSELATION = "SET_TESSELATION";

export const ADD = "ADD_SITES";
export const DELETE = "DELETE_SITES";
export const MOVE = "MOVE_SITE";
export const KILL = "KILL_STAGE";


export function setTesselationDataAction(tesselationData) {
    return { type: SET_TESSELATION, payload: { tesselationData } };
}

export function addNodesAction(...points: number[][]) {
    return { type: ADD, payload: { points } };
}
export function deleteNodesAction(...ids: string[]) {
    return { type: DELETE, payload: { ids } };
}
export function moveNodeAction(id: string, dx: number, dy: number) {
    return { type: MOVE, payload: { id, dx, dy } };
}
export function killStageAction() {
    return { type: KILL };
}
