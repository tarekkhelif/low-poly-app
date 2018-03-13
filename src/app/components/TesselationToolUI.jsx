/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { noop } from "../util/funcTools";
import { executeOnPlainMouseDown } from "../util/eventTools";

import {
    TESSELATION_SELECT_MODE,
    TESSELATION_CREATE_MODE,
    TESSELATION_EDIT_MODE
} from "../actions/actionTypes";

import { setSelectionAction } from "../actions/actionGenerators";

import { HandlerInstaller } from "./HandlerInstaller";
import { Outline } from "./Outline";
import { MeshPolygons } from "./MeshPolygons";

const MeshNodes = ({ id }) => <g id={id} />;

type Props = {
    dispatch: (action: Object) => Object,
    mode: string,
    selection: string,
    patches: Object
};
const mapStateToProps = ({ currentTool: { mode }, selection, patches }) => ({
    mode,
    selection,
    patches
});
// eslint-disable-next-line max-len
export const TesselationToolUI = connect(mapStateToProps)(class extends React.Component<Props> {
    constructor(props) {
        super(props);

        // I think this is necessary for dispatch to work???
        this.setSelection = this.setSelection.bind(this);
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
                        modifiersWrapper: executeOnPlainMouseDown
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
                        handler: () => setSelection(null),
                        modifiersWrapper: executeOnPlainMouseDown
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
                        modifiersWrapper: executeOnPlainMouseDown
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
    // #endregion

    render() {
        const { mode, selection, patches } = this.props;

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

                    // Render according to mode
                    let toDisplay;
                    switch (mode) {
                        case TESSELATION_SELECT_MODE: {
                            toDisplay = (
                                <React.Fragment>
                                    <MeshPolygons
                                        id={`${patchId}-meshPolygons`}
                                        mesh={mesh}
                                    />
                                    <Outline
                                        id={`${patchId}-outline`}
                                        selected={selected}
                                        outline={outline}
                                    />
                                </React.Fragment>
                            );
                            break;
                        }
                        case TESSELATION_CREATE_MODE: {
                            toDisplay = (
                                <React.Fragment>
                                    <MeshPolygons
                                        id={`${patchId}-meshPolygons`}
                                        mesh={mesh}
                                    />
                                    <Outline
                                        id={`${patchId}-outline`}
                                        selected={selected}
                                        outline={outline}
                                    />
                                </React.Fragment>
                            );
                            break;
                        }
                        case TESSELATION_EDIT_MODE: {
                            toDisplay = (
                                <React.Fragment>
                                    <MeshPolygons
                                        id={`${patchId}-meshPolygons`}
                                        mesh={mesh}
                                    />
                                    <Outline
                                        id={`${patchId}-outline`}
                                        selected={selected}
                                        outline={outline}
                                    />
                                    {selected ? (
                                        <MeshNodes
                                            id={`${patchId}-meshNodes`}
                                            mesh={mesh}
                                        />
                                    ) : null}
                                </React.Fragment>
                            );
                            break;
                        }
                        default: {
                            toDisplay = (
                                <React.Fragment>
                                    <MeshPolygons
                                        id={`${patchId}-meshPolygons`}
                                        mesh={mesh}
                                    />
                                    <Outline
                                        id={`${patchId}-outline`}
                                        selected={selected}
                                        outline={outline}
                                    />
                                </React.Fragment>
                            );
                        }
                    }

                    const patchEventHandler =
                            mode === TESSELATION_SELECT_MODE
                                ? executeOnPlainMouseDown((e) => {
                                    e.stopPropagation();
                                    this.setSelection(patchId);
                                })
                                : executeOnPlainMouseDown(noop);

                    return (
                        <g
                            key={patchId}
                            id={patchId}
                            className="patch"
                            onMouseDown={patchEventHandler}
                        >
                            {toDisplay}
                        </g>
                    );
                })}
            </g>
        );
    }
});
