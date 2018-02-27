/* Ad hoc experimenting and testing */

/* eslint-disable no-console */

import { store as sitesStore } from "./sitesStore";

import { addSites, deleteSites, moveSite, killStage } from "./siteActions";

export function testThings() {
    // Log initial state
    console.log(sitesStore.getState());

    // Log on each state change.  Save function to unsubscribe later.
    const unsubscribe = sitesStore.subscribe(() =>
        console.log(sitesStore.getState()));

    // Try some actions
    const sites = [[4, 3], [55, 55], [14, 32]];
    sites.forEach((point, i) => {
        point.id = i.toString();
    });

    sitesStore.dispatch(addSites(sites));
    sitesStore.dispatch(deleteSites(["1"]));
    sitesStore.dispatch(moveSite("0", [-2, 4.31]));
    sitesStore.dispatch(killStage());

    unsubscribe();
}
