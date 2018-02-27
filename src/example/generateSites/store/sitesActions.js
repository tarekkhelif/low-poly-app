// @flow

export const ADD = "ADD_SITES";
export const DELETE = "DELETE_SITES";
export const MOVE = "MOVE_SITE";
export const KILL = "KILL_STAGE";

export function addSitesAction(...points: number[][]) {
    return { type: ADD, points };
}
export function deleteSitesAction(...ids: string[]) {
    return { type: DELETE, ids };
}
export function moveSiteAction(id: string, newLocation: number[]) {
    return { type: MOVE, id, newLocation };
}
export function killStageAction() {
    return { type: KILL };
}
