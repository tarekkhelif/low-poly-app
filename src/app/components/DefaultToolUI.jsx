/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { Outline } from "./Outline";

const mapStateToProps = ({ patches }) => ({ patches });
export const DefaultToolUI = connect(mapStateToProps)(({ patches }) => (
    <g className="defaultToolUI">
        {Object.entries(patches).map((patchEntry) => {
            const [
                patchId,
                {
                    outline,
                    meshNodes: { nodes: meshNodes },
                    meshPolygons: { polygons }
                }
            ] = patchEntry;
            return (
                <React.Fragment key={`${patchId}-fragment`}>
                    <Outline
                        key={`${patchId}-outline`}
                        id={`${patchId}-outline`}
                        outline={outline}
                    />
                    <g
                        key={`${patchId}-polygons`}
                        id={`${patchId}-polygons`}
                        className="polygons"
                    >
                        {Object.entries(polygons).map((polygonEntry) => {
                            const [
                                polygonId,
                                { nodeIds, color }
                            ] = polygonEntry;

                            const polygonPoints = nodeIds.map((nodeId) => {
                                const { point } = meshNodes[nodeId];
                                return point;
                            });

                            const polygonPathString =
                                polygonPoints.length > 0
                                    ? `M ${polygonPoints.join(" L ")} Z`
                                    : "";

                            return (
                                <path
                                    key={polygonId}
                                    id={polygonId}
                                    className="polygon"
                                    d={polygonPathString}
                                    style={{ stroke: color, fill: color }}
                                />
                            );
                        })}
                    </g>
                </React.Fragment>
            );
        })}
    </g>
));
