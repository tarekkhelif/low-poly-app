import { ADD, DELETE, MOVE } from "../store/actions";


export function nodesReducer(state: Object = {}, action): Object {
    switch (action.type) {
        case ADD: {
            const { nodes } = action.payload;
            return { ...state, ...nodes };
        }
        case DELETE: {
            const { ids: delIDs } = action.payload;

            const keptNodes = {};
            Object.entries(state).forEach(([id, point]) => {
                if (delIDs.indexOf(id) !== 0) {
                    keptNodes[id] = point;
                }
            });

            return keptNodes;
        }
        case MOVE: {
            const { id, newPoint } = action.payload;

            const nextNodes = { ...state };
            nextNodes[id] = { point: newPoint };

            return nextNodes;
        }
        default: {
            return state;
        }
    }
}
