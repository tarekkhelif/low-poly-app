/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { setSelectionAction } from "../actions/actionGenerators";

import { Outline } from "./Outline";
import { OutlineNodes } from "./OutlineNodes";

const mapStateToProps = ({ selection, patches }) => ({ selection, patches });
export const OutlineToolUI = connect(mapStateToProps)((props) => {
    const { dispatch, selection, patches } = props;

    return (
        <g className="outlineToolUI">
            {Object.entries(patches).map((patchEntry) => {
                const [patchId, { outline }] = patchEntry;

                const selected = patchId === selection;
                const selectPatch = (e) => {
                    e.stopPropagation();

                    const correctModifiers =
                        !e.ctrlKey && !e.altKey && !e.shiftKey && !e.button;
                    if (correctModifiers) {
                        dispatch(setSelectionAction(patchId));
                    }
                };

                return (
                    <g
                        key={patchId}
                        id={patchId}
                        className="patch"
                        onMouseDown={selectPatch}
                    >
                        <Outline
                            id={`${patchId}-outline`}
                            selected={selected}
                            outline={outline}
                        />
                        <OutlineNodes
                            patchId={patchId}
                            nodes={outline.nodes}
                            selected={selected}
                        />
                    </g>
                );
            })}
        </g>
    );
});
