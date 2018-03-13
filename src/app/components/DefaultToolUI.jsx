/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { Outline } from "./Outline";
import { MeshPolygons } from "./MeshPolygons";

const mapStateToProps = ({ selection, patches }) => ({ selection, patches });
export const DefaultToolUI = connect(mapStateToProps)((props) => {
    const { selection, patches } = props;

    return (
        <g className="defaultToolUI">
            {Object.entries(patches).map((patchEntry) => {
                const [patchId, { outline, mesh }] = patchEntry;

                const selected = patchId === selection;

                return (
                    <g key={patchId} id={patchId} className="patch">
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
            })}
        </g>
    );
});
