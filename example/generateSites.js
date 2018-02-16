// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

import { randPtInPoly } from "./util/geometry.js";
import { IncrementalId as idGenerator } from "./util/id.js";

// Actions
const ADD = "ADD_SITES";
const DELETE = "DELETE_SITES";
const MOVE = "MOVE_SITE";

// Install listeners on each .site DOM element
function installSiteDOMElementListeners(/* selection */) {}

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
            this.state = [];

            this.executeAction = (action) => {
                // const siteIdGenerator = new idGenerator("site");
                let newState;
                switch (action.type) {
                    case ADD:
                        newState = [...this.state, ...action.sites];
                        break;
                    case DELETE:
                        newState = this.state.filter((site) => {
                            const shouldDelete =
                                action.sites.indexOf(site) !== -1;
                            return shouldDelete;
                        });
                        break;
                    case MOVE:
                        {
                            const i = this.state.indexOf(action.oldLocation);
                            newState = [
                                ...this.state.slice(0, i),
                                action.newLocation,
                                ...this.state.slice(i + 1)
                            ];
                        }
                        break;
                    default:
                        // eslint-disable-next-line no-console
                        console.log("Default action taken.");
                        newState = this.state;
                }
                // this.actionHistory.push(action);
                this.state = newState;
                this.dispacher.dispach("stateChange", this.state);
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
                deliveryPoint.sitesData = this.state;
            };
        }();

        this.globalState = that.data;
        this.globalView = d3.select("#svgProject"); // that.d3Project.svg;
        this.stageTools = that.view.document.querySelector("#stageTools");
        this.outlineData = that.data.outlineData;
    }

    run() {
        this.reducer.executeAction({});
        this.setUpView(/* svg */);
        this.setUpControls(/* stageTools and svg layer containing UI stuff */);
    }

    // Initialize stuff for how the data is rendered in the view
    setUpView() {
        const view = this.globalView.append("g").classed("sites", true);

        function updateView(state) {
            const existing = view.selectAll(".sites").data(state);

            const entering = existing
                .enter()
                .append("circle")
                .classed("site", true)
                // .attr("id", (d) => d.id)
                .call(installSiteDOMElementListeners);

            // Set location of existing and entering .site DOM elements
            entering
                .merge(existing)
                .attr("cx", (d) => d[0])
                .attr("cy", (d) => d[1]);

            // Remove unneeded DOM elements
            existing.exit().remove();
        }

        this.reducer.dispacher.on("stateChange", updateView);
    }

    // Install all user control components
    setUpControls() {
        // Aliases for attributes of `this` that are used in controls
        const requestAction = this.reducer.executeAction;
        const stageTools = this.stageTools;
        const outlineData = this.outlineData;
        const outlineElement = this.globalView.select(".outline");

        // Tool Actions
        function addSites(...sites) {
            requestAction({ type: ADD, sites });
        }
        function deleteSites(...sites) {
            requestAction({ type: DELETE, sites });
        }
        function moveSite(oldLocation, newLocation) {
            requestAction({ type: MOVE, oldLocation, newLocation });
        }
        function addRandSites(n) {
            const randSites = d3.range(n).map(() => randPtInPoly(outlineData));
            addSites(...randSites);
        }

        // Install listener to the outline for adding sites
        function outlineMousedowned() {
            addSites(d3.mouse(this));
        }
        outlineElement.on("mousedown", outlineMousedowned);

        // Install control pane tool for adding random sites
        randSitesPaneTool(stageTools, addRandSites);
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
