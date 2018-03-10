/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { setSelectionAction } from "../actions/actionGenerators";

import { Outline } from "./Outline";
import { Mesh } from "./Mesh";

const mapStateToProps = ({ patches }) => ({ patches });
export const DefaultToolUI = connect(mapStateToProps)((props) => {
    const { dispatch, patches } = props;

    return (
        <g className="defaultToolUI">
            {Object.entries(patches).map((patchEntry) => {
                const [patchId, { outline, mesh }] = patchEntry;
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
                        <Outline id={`${patchId}-outline`} outline={outline} />
                        <Mesh id={`${patchId}-mesh`} mesh={mesh} />
                    </g>
                );
            })}
        </g>
    );
});
