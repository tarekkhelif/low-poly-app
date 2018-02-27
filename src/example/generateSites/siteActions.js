// @flow

// import { randPtInPoly } from "./util/geometry.js";

export const ADD = "ADD_SITES";
export const DELETE = "DELETE_SITES";
export const MOVE = "MOVE_SITE";
export const KILL = "KILL_STAGE";

export function addSites(points: number[][]) {
    return { type: ADD, points };
}
export function deleteSites(ids: string[]) {
    return { type: DELETE, ids };
}
export function moveSite(id: string, newLocation: number[]) {
    return { type: MOVE, id, newLocation };
}
export function killStage() {
    return { type: KILL };
}
