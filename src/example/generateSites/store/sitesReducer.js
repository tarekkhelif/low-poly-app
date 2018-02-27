// @flow

import { combineReducers } from "redux";

import { IncrementalId } from "../../util/id.js";

import { ADD, DELETE, MOVE, KILL } from "./sitesActions";
import type { Site } from "../types/types";

const idGenerator = new IncrementalId("site");

function globalState(state = {}) {
    return state;
}

function outlineData(state: number[][] = []): number[][] {
    return state;
}

function sites(state: Site[] = [], action): Site[] {
    let returnVal;
    switch (action.type) {
        // { type: ADD, points}
        case ADD: {
            const newSites = action.points.map((point) => ({
                point,
                id: idGenerator.newId()
            }));

            returnVal = [...state, ...newSites];
            break;
        }
        // { type: DELETE, ids }
        case DELETE: {
            returnVal = [
                ...state.filter((site) => {
                    const keep = action.ids.indexOf(site.id) === -1;
                    return keep;
                })
            ];
            break;
        }
        // { type: MOVE, id, newLocation }
        case MOVE: {
            returnVal = state.map((site) =>
                (site.id === action.id
                    ? { point: action.newLocation, id: site.id }
                    : site));
            break;
        }
        default: {
            returnVal = state;
        }
    }

    return returnVal;
}

function active(state: boolean = true, action): boolean {
    let returnVal;
    switch (action.type) {
        // { type: KILL }
        case KILL: {
            returnVal = false;
            break;
        }
        default:
            returnVal = state;
    }

    return returnVal;
}

export const reducer = combineReducers({
    globalState,
    outlineData,
    sites,
    active
});
