// @flow

import { combineReducers } from "redux";

import { IncrementalId } from "../../util/id.js";

import { ADD, DELETE, MOVE, KILL } from "../../app/store/appActions";
import type { Site } from "../types/types";

const idGenerator = new IncrementalId("site");

function globalState(state = {}) {
    return state;
}

function outlineData(state: number[][] = []): number[][] {
    return state;
}

function sites(sites: Object = {}, action): Object {
    let returnValue;
    switch (action.type) {
        // { type: ADD, payload: { points } }
        case ADD: {
            const points = action.payload.points;

            const newSites = {};
            points.forEach((point) => {
                const id = idGenerator.newId()
                newSites[id] = point;
            });

            returnValue = { ...sites, ...newSites };
            break;
        }
        // { type: DELETE, payload: { ids } }
        case DELETE: {
            const deleteIds = action.payload.ids;
            const sitesKeys = Object.keys(sites);

            returnValue = {};
            sitesKeys.forEach((id) => {
                if (deleteIds.indexOf(id) === -1) {
                    returnValue[id] = sites[id];
                }
            });


            break;
        }
        case MOVE: {
            const { id: actionId, dx, dy } = action.payload;

            const newNodes = { ...sites };

            const [oldX, oldY] = sites[actionId];
            newNodes[actionId] = [oldX + dx, oldY + dy];

            returnValue = newNodes;
            break;
        }
        default: {
            returnValue = sites;
        }
    }

    return returnValue;
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

export const siteStageReducer = combineReducers({
    globalState,
    outlineData,
    sites,
    active
});
