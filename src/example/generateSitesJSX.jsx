/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import * as d3 from "d3";

import React from "react";
import ReactDOM from "react-dom";

// import { randPtInPoly } from "./util/geometry.js";
import { IncrementalId } from "./util/id.js";

import { NumPicker, EndStage } from "./generateSites/paneToolsComponents";
import { Site } from "./generateSites/stageGroupComponents";

// ACTIONS
const ADD = "ADD_SITES";
const DELETE = "DELETE_SITES";
const MOVE = "MOVE_SITE";
const KILL = "KILL_STAGE";

class PaneTools extends React.Component {
    constructor(props) {
        super(props);

        this.justExists = "Just exists";
    }

    render() {
        return (
            <React.Fragment>
                <NumPicker active={this.props.active} />
                <EndStage active={this.props.active} />
            </React.Fragment>
        );
    }
}

class StageGroup extends React.Component {
    constructor(props) {
        super(props);

        this.justExists = "Just exists";
    }

    render() {
        return (
            <React.Fragment>
                {this.props.sites.map((point) => <Site point={point} />)}
            </React.Fragment>
        );
    }
}

const reducer = (oldState, action) => {
    let nextSites;
    let nextActive;

    switch (action.type) {
        case ADD: {
            nextSites = [...oldState.sites, ...action.sites];
            nextActive = true;
            break;
        }
        case DELETE: {
            nextSites = [
                ...oldState.sites.filter((point) => {
                    const keep = action.sites.indexOf(point) === -1;
                    return keep;
                })
            ];
            nextActive = true;
            break;
        }
        case MOVE: {
            const i = oldState.sites.indexOf(action.oldLocation);
            nextSites = [
                ...oldState.sites.slice(0, i),
                action.newLocation,
                ...oldState.sites.slice(i + 1)
            ];
            nextActive = true;
            break;
        }
        case KILL: {
            nextSites = [...oldState.sites];
            nextActive = false;
            break;
        }
        default: {
            nextActive = oldState.active;
            nextSites = [...oldState.sites];
        }
    }

    const nextState = { sites: nextSites, active: nextActive };

    return nextState;
};

class SiteChooser {
    constructor(/* that */) {
        this.stageGroup = d3
            .select("#svgProject")
            .append("g")
            .classed("sites", true)
            .node();
        this.stageTools = document.querySelector("#stageTools");

        // this.outlineData = that.data.outlineData;

        // this.store = new function Store() {
        //     const idGenerator = new IncrementalId("site");
        //     let state = updateState({});

        //     const updateState = (action) => {
        //         const newState = new Proxy([], {
        //             set(target, key, value) {
        //                 const keyIsNumber =
        //                     !Number.isNaN(Number(key)) && key !== "";

        //                 if (!value.id && keyIsNumber) {
        //                     value.id = idGenerator.newId();
        //                 }
        //                 target[key] = value;
        //                 return true;
        //             }
        //         });

        //         newState.push(...reducer(state, action));

        //         state = newState;
        //     };
        // }();
    }

    run() {
        const state = {
            active: true,
            sites: Array.from(Array(20)).map(() => [
                Math.random() * 400 + 100,
                Math.random() * 400 + 100
            ])
        };
        ReactDOM.render(<PaneTools active={state.active} />, this.stageTools);
        ReactDOM.render(
            <StageGroup active={state.active} sites={state.sites} />,
            this.stageGroup
        );
    }
}

// Coerce siteChooser to work the old way; like a function, not an object
export function chooseSites() {
    const miniApp = new SiteChooser(this);
    miniApp.run();
}
