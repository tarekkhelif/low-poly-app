/* eslint-disable react/prop-types */
import * as d3 from "d3";
import { paper } from "paper";

import React from "react";
import ReactDOM from "react-dom";

import { randPtInPoly } from "./util/geometry.js";
import { IncrementalId } from "./util/id.js";

// ACTIONS
const ADD = "ADD_SITES";
const DELETE = "DELETE_SITES";
const MOVE = "MOVE_SITE";
const KILL = "KILL_STAGE";

function SiteElem(props) {
    return (<cirlce className="site" key={props.point.id} cx={props.point[0]} cy={props.point[1]} />);
}

// SITE ELEMENT FACTORY.  TODO: implement with React instead
function siteElement(d) {
    const site = d3
        .select("svg") // Seems to be impossible to create a detached element
        .append("circle")
        .classed("site", true)
        .attr("id", d.id)
        .call((selection) =>
            Object.entries(siteElement.handlers).forEach(([type, callback]) =>
                selection.on(type, callback)));

    return site.node();
}
siteElement.handlers = {};
siteElement.on = (eventType, handlerCallback) => {
    siteElement.handlers[eventType] = handlerCallback;
};

// RESPOND TO STATE CHANGE
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

// BUILD CONTROL UI
function addSiteClick(outlineElement, addSites, storeDispacher) {
    // eslint-disable-next-line func-names
    outlineElement.on("mousedown.add", function () {
        addSites(d3.mouse(this));
    });
    storeDispacher.on("kill", () => outlineElement.on("mousedown.add", null));
}

function deleteSiteClick(siteElement, deleteSites, storeDispacher) {
    siteElement.on("mousedown.delete", (d) => deleteSites(d));
    // TODO: After reimplementing `siteElement` with React, make them remove
    //         their listeners on kill
    // storeDispacher.on("kill", () => siteElement.on("mousedown.delete", null));
}

function moveSiteDrag(siteElement, moveSite, storeDispacher) {
    (() => {})(); // placeholder no-op
}

function randSitesPaneTool(toolContainer, addRandSites, storeDispacher) {
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
    const handleClick = () => addRandSites(numPickerInput.value);
    numPickerButton.addEventListener("click", handleClick);
    numPicker.appendChild(numPickerButton);

    // Deactivate button on kill
    storeDispacher.on("kill", () => {
        numPickerButton.removeEventListener("click", handleClick);
        numPickerButton.disabled = true;
        numPickerInput.disabled = true;
    });
}

function endStagePaneTool(toolContainer, closeStage, storeDispacher) {
    // endStage div
    const endStage = document.createElement("div");
    endStage.id = "endStage";
    toolContainer.appendChild(endStage);

    // Button to execute `closeStage`
    const endStageButton = document.createElement("button");
    endStageButton.id = "endStageButton";
    endStageButton.innerHTML = "Done with Seeds";
    const handleClick = () => closeStage();
    endStageButton.addEventListener("click", handleClick);
    endStage.appendChild(endStageButton);

    // Deactivate button on kill
    storeDispacher.on("kill", () => {
        endStageButton.removeEventListener("click", handleClick);
        endStageButton.disabled = true;
    });
}

// Mini App
/* export */ class SiteChooser {
    constructor(that) {
        this.globalState = that.data;
        this.globalView = d3.select("#svgProject"); // that.d3Project.svg;
        this.stageToolsElement = that.view.document.querySelector("#stageTools");
        this.outlineData = that.data.outlineData;

        // Reducer
        this.reducer = new function Reducer(globalState) {
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

                        state = newState;
                        this.dispacher.dispach("stateChange", state);
                        break;
                    case DELETE:
                        newState.push(...state.filter((site) => {
                            const keep = action.sites.indexOf(site) === -1;
                            return keep;
                        }));

                        state = newState;
                        this.dispacher.dispach("stateChange", state);
                        break;
                    case MOVE:
                        {
                            const i = state.indexOf(action.oldLocation);
                            newState.push(
                                ...state.slice(0, i),
                                action.newLocation,
                                ...state.slice(i + 1)
                            );

                            state = newState;
                            this.dispacher.dispach("stateChange", state);
                        }
                        break;
                    case KILL:
                        // Tell this stage's UI to stop listening user input
                        this.dispacher.dispach("kill");
                        // Write this stage's state to global state
                        Object.freeze(this);
                        globalState.sitesData = state;
                        break;
                    default:
                        // eslint-disable-next-line no-console
                        console.log("Default action taken.");
                }
                // this.actionHistory.push(action);
            };

            this.dispacher = new function Dispacher() {
                const emmittedEvents = ["stateChange", "kill"];
                // TODO: throw error for unrecognized event types
                this.handlers = {};
                emmittedEvents.forEach((eventType) => {
                    this.handlers[eventType] = [];
                });

                this.dispach = (eventType, ...args) => {
                    this.handlers[eventType].forEach((handler) =>
                        handler.call(null, ...args));
                };

                this.on = (eventType, handler) => {
                    this.handlers[eventType].push(handler);
                };
            }();
        }(this.globalState);
    }

    run() {
        this.reducer.executeAction({});
        this.setUpViewReact(/* svg */);
        // this.setUpView();
        this.setUpControls(/* stageToolsElement, svg layer with UI stuff */);
    }

    // Initialize stuff for how the data is rendered in the view
    // i.e. STUFF THAT RESPONDS TO STATE CHANGES
    setUpView() {
        const sitesView = this.globalView.append("g").classed("sites", true);

        this.reducer.dispacher.on("stateChange", (state) =>
            updateSitesView(sitesView, state));
    }

    setUpViewReact() {
        const sitesViewReactContainer = this.globalView.append("g").classed("sitesReactContainer", true);
        
        this.reducer.dispacher.on("stateChange", (points) => {
            const sitesView = <g className="sites">{points.map((point) => <circle className="site" key={point.id} cx={point[0]} cy={point[1]} />)}</g>;

            ReactDOM.render(sitesView, sitesViewReactContainer.node());
        })
    }

    // Install all user control components
    // i.e. STUFF THAT INITIATES STATE CHANGES
    setUpControls() {
        // Aliases for attributes of `this` that are used in controls
        const storeDispacher = this.reducer.dispacher;
        const requestAction = this.reducer.executeAction;
        const stageToolsElement = this.stageToolsElement;
        const outlineData = this.outlineData;
        const outlineElement = this.globalView.select(".outline");

        // UI components: { UI installer, DOM target, action }
        //   where UI installer = function(domTarget, action, storeDispacher)
        const controls = [
            {
                // Add a site on click inside the outline
                installer: addSiteClick,
                domTarget: outlineElement,
                action: (...sites) => requestAction({ type: ADD, sites })
            },
            {
                // Delete a site when clicked
                installer: deleteSiteClick,
                domTarget: siteElement,
                action: (...sites) => requestAction({ type: DELETE, sites })
            },
            {
                // Control Pane: eneter number of sites to randomly add
                installer: randSitesPaneTool,
                domTarget: stageToolsElement,
                action: (n) => {
                    const randSites = d3
                        .range(n)
                        .map(() => randPtInPoly(outlineData));
                    requestAction({ type: ADD, sites: randSites });
                }
            },
            {
                // Control pane: declare this stage done
                installer: endStagePaneTool,
                domTarget: stageToolsElement,
                action: () => requestAction({ type: KILL }) // this.reducer.kill(this.globalState)
            }
        ];

        controls.forEach(({ installer, domTarget, action }) => {
            installer(domTarget, action, storeDispacher);
        });
    }
}

// Coerce siteChooser to work the old way; like a function, not an object
/* export */ function chooseSites() {
    const miniApp = new SiteChooser(this);
    miniApp.run();
}

/* export */ function exampleSites(n) {
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

export { chooseSites };
