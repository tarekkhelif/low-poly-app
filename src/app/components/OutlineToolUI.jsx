/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { setSelectionAction } from "../actions/actionGenerators";

import { Outline } from "./Outline";

const mapStateToProps = ({ selection, patches }) => ({ selection, patches });
export const OutlineToolUI = connect(mapStateToProps)((props) => {
    const { dispatch, selection, patches } = props;

    return (
        <g className="outlineToolUI">
            {Object.entries(patches).map((patchEntry) => {
                const [patchId, { outline }] = patchEntry;
                const selected = patchId === selection;

                return (
                    <g
                        key={patchId}
                        id={patchId}
                        className="patch"
                        onMouseDown={(e) => {
                            dispatch(setSelectionAction(patchId));
                            e.stopPropagation();
                        }}
                    >
                        <Outline
                            id={`${patchId}-outline`}
                            selected={selected}
                            outline={outline}
                        />
                        <g
                            className="outlineNodes"
                            visibility={selected ? "inherit" : "hidden"}
                        >
                            {Object.entries(outline.nodes).map((entry) => {
                                const [nodeId, { point: [cx, cy] }] = entry;
                                return (
                                    <circle
                                        key={nodeId}
                                        id={nodeId}
                                        className="outlineNode"
                                        cx={cx}
                                        cy={cy}
                                    />
                                );
                            })}
                        </g>
                    </g>
                );
            })}
        </g>
    );
});
