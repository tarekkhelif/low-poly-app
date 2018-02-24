import * as d3 from "d3";

const paper = require("paper");

import { randPtInPoly } from "./util/geometry.js";
import { IncrementalId } from "./util/id.js";

// Actions
const ADD = "ADD_SITES";
const DELETE = "DELETE_SITES";
const MOVE = "MOVE_SITE";

function siteElement(d) {
    const site = d3
        .select("svg") // Seems to be impossible to create a detached element
        .append("circle")
        .classed("site", true)
        .attr("id", d.id)
        .call((selection) =>
            siteElement.handlers.forEach(({ eventType, handlerCallback }) =>
                selection.on(eventType, handlerCallback)));

    return site.node();
}
siteElement.handlers = [];
siteElement.on = (eventType, handlerCallback) => {
    siteElement.handlers.push({ eventType, handlerCallback });
};

function updateSitesView(sitesView, state) {
    const existing = sitesView.selectAll("*").data(state, (d) => d.id);

    const entering = existing.enter().append(siteElement);

    // Set location of existing and entering .site DOM elements
    entering
        .merge(existing)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1]);

    // Remove unneeded DOM elements
    existing.exit().remove();
}

function addSiteClick(outlineElement, addSites) {
    outlineElement.on("mousedown", outlineMouseDowned);
    function outlineMouseDowned() {
        addSites(d3.mouse(this));
    }
}

function deleteSiteClick(siteElement, deleteSites) {
    siteElement.on("mousedown", siteMouseDowned);
    function siteMouseDowned(d) {
        deleteSites(d);
    }
}

function moveSiteDrag(siteElement, moveSite) {}

// Install control pane tool for generating random sites
function randSitesPaneTool(toolContainer, addRandSites) {
    // numPicker div
    const numPicker = document.createElement("div");
    numPicker.id = "numPicker";
    toolContainer.appendChild(numPicker);

    // UI input for number of sites
    const numPickerInput = document.createElement("input");
    numPickerInput.type = "number";
    numPickerInput.min = 1;
    numPickerInput.max = 100;
    numPickerInput.value = 25;
    numPickerInput.required = true;
    numPicker.appendChild(numPickerInput);

    // Button to generate sites
    const numPickerButton = document.createElement("button");
    numPickerButton.id = "numPickerButton";
    numPickerButton.innerHTML = "➡";
    // Generate `n` random points onclick
    numPickerButton.addEventListener("click", () =>
        addRandSites(numPickerInput.value));
    numPicker.appendChild(numPickerButton);
}

// Mini App
export class SiteChooser {
    constructor(that) {
        // Reducer
        this.reducer = new function Reducer() {
            // eslint-disable-next-line no-underscore-dangle
            const idGenerator = new IncrementalId("site");
            let state = [];

            this.executeAction = (action) => {
                const newState = new Proxy([], {
                    set(target, key, value) {
                        if (
                            !Number.isNaN(Number(key)) &&
                            key !== "" &&
                            !value.id
                        ) {
                            value.id = idGenerator.newId();
                        }
                        target[key] = value;
                        return true;
                    }
                });
                switch (action.type) {
                    case ADD:
                        newState.push(...state, ...action.sites);
                        break;
                    case DELETE:
                        newState.push(...state.filter((site) => {
                            const keep = action.sites.indexOf(site) === -1;
                            return keep;
                        }));
                        break;
                    case MOVE:
                        {
                            const i = state.indexOf(action.oldLocation);
                            newState.push(
                                ...state.slice(0, i),
                                action.newLocation,
                                ...state.slice(i + 1)
                            );
                        }
                        break;
                    default:
                        // eslint-disable-next-line no-console
                        console.log("Default action taken.");
                }
                // this.actionHistory.push(action);
                state = newState;

                this.dispacher.dispach("stateChange", state);
            };
            this.dispacher = new function Dispacher() {
                this.handlers = { stateChange: [] };

                this.dispach = (eventType, ...args) => {
                    this.handlers[eventType].forEach((handler) =>
                        handler.call(null, ...args));
                };

                this.on = (eventType, handler) => {
                    this.handlers[eventType].push(handler);
                };
            }();
            this.kill = (deliveryPoint) => {
                Object.freeze(this);
                deliveryPoint.sitesData = state;
            };
        }();

        this.globalState = that.data;
        this.globalView = d3.select("#svgProject"); // that.d3Project.svg;
        this.stageToolsElement = that.view.document.querySelector("#stageTools");
        this.outlineData = that.data.outlineData;
    }

    run() {
        this.reducer.executeAction({});
        this.setUpView(/* svg */);
        this.setUpControls(/* stageToolsElement, svg layer with UI stuff */);
    }

    // Initialize stuff for how the data is rendered in the view
    // i.e. STUFF THAT RESPONDS TO STATE CHANGES
    setUpView() {
        const sitesView = this.globalView.append("g").classed("sites", true);

        this.reducer.dispacher.on("stateChange", (state) =>
            updateSitesView(sitesView, state));
    }

    // Install all user control components
    // i.e. STUFF THAT INITIATES STATE CHANGES
    setUpControls() {
        // Aliases for attributes of `this` that are used in controls
        const requestAction = this.reducer.executeAction;
        const stageToolsElement = this.stageToolsElement;
        const outlineData = this.outlineData;
        const outlineElement = this.globalView.select(".outline");

        // Tool Actions
        function addSites(...sites) {
            requestAction({ type: ADD, sites });
        }
        function deleteSites(...sites) {
            requestAction({ type: DELETE, sites });
        }
        // function moveSite(oldLocation, newLocation) {
        //     requestAction({ type: MOVE, oldLocation, newLocation });
        // }
        function addRandSites(n) {
            const randSites = d3.range(n).map(() => randPtInPoly(outlineData));
            addSites(...randSites);
        }

        // Install listener to the outline for adding sites
        addSiteClick(outlineElement, addSites);
        // function deleteSiteClick(siteElement, deleteSites)
        deleteSiteClick(siteElement, deleteSites);
        // moveSiteDrag(siteElement, moveSite);

        // Install control pane tool for adding random sites
        randSitesPaneTool(stageToolsElement, addRandSites);
    }

    // Disables changing this phase's state and records the final state on the
    //   global state
    closeStage() {
        this.reducer.kill(this.globalState);
    }
}

// Runner -- coerce siteChooser to work the old way; like a function

export function chooseSites() {
    const miniApp = new SiteChooser(this);
    miniApp.run();
}

export function exampleSites(n) {
    // Generate `n` random points
    const randSites = d3
        .range(n)
        .map(() => randPtInPoly(this.data.outlineData));

    // Add the points to the svg
    const d3Sites = this.d3Project.svg
        .append("g") // ............. Create group for sites (seed points for
        .attr("id", "sites") // .....   Voronoi diagram)
        .selectAll("*")
        .data(randSites) // ......... Associate this.data with group's children
        .enter()
        .append("circle") // ........ Add sites to SVG
        .classed("site", true)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1]);

    // Add the sites to paper.js canvas
    const pjsSites = randSites.map((site) =>
        new paper.Path.Circle({
            center: new paper.Point(site),
            radius: 10,
            fillColor: new paper.Color("rgba(198, 81, 81, 0.404)")
        }));

    // Save useful stuff to project objects
    Object.assign(this.d3Project, { d3Sites });
    Object.assign(this.pjsProject, { pjsSites });
    Object.assign(this.data, { sitesData: randSites });
}
