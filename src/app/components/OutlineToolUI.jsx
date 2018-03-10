/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { setSelectionAction } from "../actions/actionGenerators";

import { Outline } from "./Outline";
import { Nodes } from "./Nodes";

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
                        <Nodes nodes={outline.nodes} selected={selected} />
                    </g>
                );
            })}
        </g>
    );
});
