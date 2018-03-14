/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import * as d3 from "d3";

import { noop } from "../util/funcTools";
import { onPlainMouseDown } from "../util/eventTools";

import {
    TESSELATION_SELECT_MODE,
    TESSELATION_CREATE_MODE,
    TESSELATION_EDIT_MODE
} from "../actions/actionTypes";

import {
    setSelectionAction,
    voronoiAddSiteAction
} from "../actions/actionGenerators";

import { HandlerInstaller } from "./HandlerInstaller";
import { Outline } from "./Outline";
import { MeshPolygons } from "./MeshPolygons";
import { MeshNodes } from "./MeshNodes";
import { VoronoiSites } from "./VoronoiSites";

type Props = {
    dispatch: (action: Object) => Object,
    mode: string,
    modeState: Object,
    selection: string,
    patches: Object
};
const mapStateToProps = ({
    currentTool: { mode, modeState },
    selection,
    patches
}) => ({
    mode,
    modeState,
    selection,
    patches
});
// eslint-disable-next-line max-len
export const TesselationToolUI = connect(mapStateToProps)(class extends React.Component<Props> {
    constructor(props) {
        super(props);

        // I think this is necessary for dispatch to work???
        this.setSelection = this.setSelection.bind(this);
        this.addVoronoiSite = this.addVoronoiSite.bind(this);
    }

    // eslint-disable-next-line react/sort-comp
    createListeners() {
        const { setSelection } = this;

        // Create all the listeners for each mode, which may depend on props
        const workspaceElement = document.querySelector(".workspace");
        const handlers = new Map([
            [
                TESSELATION_SELECT_MODE,
                [
                    {
                        // Clear the selection
                        element: workspaceElement,
                        eventType:
                                "mousedown.select.workspace.tesselationTool",
                        handler: () => setSelection(null),
                        modifiersWrapper: onPlainMouseDown
                    }
                ]
            ],
            [
                TESSELATION_CREATE_MODE,
                [
                    {
                        // Clear the selection
                        element: workspaceElement,
                        eventType:
                                "mousedown.create.workspace.tesselationTool",
                        handler: noop,
                        modifiersWrapper: onPlainMouseDown
                    }
                ]
            ],
            [
                TESSELATION_EDIT_MODE,
                [
                    {
                        // Clear the selection
                        element: workspaceElement,
                        eventType:
                                "mousedown.edit.workspace.tesselationTool",
                        handler: () => setSelection(null),
                        modifiersWrapper: onPlainMouseDown
                    }
                ]
            ]
        ]);

        return handlers;
    }

    // ACTION DISPATCHERS
    // #region

    setSelection(id) {
        const { dispatch } = this.props;
        dispatch(setSelectionAction(id));
    }

    addVoronoiSite(point) {
        const { dispatch } = this.props;
        const randNum = Math.floor(Math.random() * 1e16);
        const siteId = `bad-ID-${randNum.toString(16)}`;

        dispatch(voronoiAddSiteAction(siteId, point));
    }
    // #endregion

    render() {
        const {
            mode, modeState, selection, patches
        } = this.props;

            // Recreate listeners in case changes in properties change what they do
        const handlers = this.createListeners();
        // Get the handlers for the current mode
        const modeHandlers = handlers.has(mode) ? handlers.get(mode) : [];

        // Move the selected patch so it is rendered on top of the others
        const patchesArray = Object.entries(patches);
        const indexOfSelected = Object.keys(patches).indexOf(selection);
        if (indexOfSelected >= 0) {
            patchesArray.push(...patchesArray.splice(indexOfSelected, 1));
        }

        // Render patches and install event handlers
        return (
            <g className="tesselationToolUI">
                {/* `HandlerInstaller` installs/updates/uninstalls listeners at
                            the appropriate lifecycle stages */}
                <HandlerInstaller handlers={modeHandlers} />
                {/* Render each patch */}
                {patchesArray.map((patchEntry) => {
                    const [patchId, { outline, mesh }] = patchEntry;
                    const selected = patchId === selection;

                    const selectPatchPlainMouseDown = onPlainMouseDown((e) => {
                        e.stopPropagation();
                        this.setSelection(patchId);
                    });

                        // Render according to mode
                    switch (mode) {
                        case TESSELATION_SELECT_MODE: {
                            return (
                                <g
                                    key={patchId}
                                    id={patchId}
                                    className="patch"
                                    onMouseDown={selectPatchPlainMouseDown}
                                >
                                    <MeshPolygons
                                        id={`${patchId}-meshPolygons`}
                                        mesh={mesh}
                                    />
                                    <Outline
                                        id={`${patchId}-outline`}
                                        selected={selected}
                                        closed
                                        outline={outline}
                                    />
                                </g>
                            );
                        }
                        case TESSELATION_CREATE_MODE: {
                            const sites = modeState;
                            return (
                                <g
                                    key={patchId}
                                    id={patchId}
                                    className="patch"
                                    onMouseDown={
                                        selected
                                            ? onPlainMouseDown((e) => {
                                                e.stopPropagation();

                                                const thisPatch =
                                                          e.currentTarget;

                                                const point = d3.clientPoint(
                                                    thisPatch,
                                                    e
                                                );

                                                this.addVoronoiSite(point);
                                            })
                                            : selectPatchPlainMouseDown
                                    }
                                >
                                    {!selected ? (
                                        <MeshPolygons
                                            id={`${patchId}-meshPolygons`}
                                            mesh={mesh}
                                        />
                                    ) : null}
                                    <Outline
                                        id={`${patchId}-outline`}
                                        selected={selected}
                                        closed
                                        outline={outline}
                                    />
                                    {selected ? (
                                        <VoronoiSites
                                            id={`${patchId}-tesselationSites`}
                                            sites={sites}
                                        />
                                    ) : null}
                                </g>
                            );
                        }
                        case TESSELATION_EDIT_MODE: {
                            return (
                                <g
                                    key={patchId}
                                    id={patchId}
                                    className="patch"
                                    onMouseDown={
                                        selected
                                            ? onPlainMouseDown(noop)
                                            : selectPatchPlainMouseDown
                                    }
                                >
                                    <MeshPolygons
                                        id={`${patchId}-meshPolygons`}
                                        mesh={mesh}
                                    />
                                    <Outline
                                        id={`${patchId}-outline`}
                                        selected={selected}
                                        closed
                                        outline={outline}
                                    />
                                    {selected ? (
                                        <MeshNodes
                                            id={`${patchId}-meshNodes`}
                                            patchId={patchId}
                                        />
                                    ) : null}
                                </g>
                            );
                        }
                        default: {
                            return (
                                <g
                                    key={patchId}
                                    id={patchId}
                                    className="patch"
                                    onMouseDown={onPlainMouseDown(noop)}
                                >
                                    <MeshPolygons
                                        id={`${patchId}-meshPolygons`}
                                        mesh={mesh}
                                    />
                                    <Outline
                                        id={`${patchId}-outline`}
                                        selected={selected}
                                        closed
                                        outline={outline}
                                    />
                                </g>
                            );
                        }
                    }
                })}
            </g>
        );
    }
});
