/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

const mapStateToProps = ({ patches }) => ({ patches });
export const DefaultToolUI = connect(mapStateToProps)(({ patches }) => (
    <g className="defaultToolUI">
        {Object.entries(patches).map((patchEntry) => {
            const [
                patchId,
                {
                    outline: { nodes: outlineNodes },
                    meshNodes: { nodes: meshNodes },
                    meshPolygons: { polygons }
                }
            ] = patchEntry;
            // prettier-ignore
            // eslint-disable-next-line function-paren-newline
            const outlinePoints = Object.entries(outlineNodes).map(
                ([outlineNodeId, { point }]) => point);

            const outlinePathString =
                outlinePoints.length > 0
                    ? `M ${outlinePoints.join(" L ")} Z`
                    : "";

            return (
                <React.Fragment>
                    <path
                        key={patchId}
                        id={patchId}
                        className="outline"
                        d={outlinePathString}
                    />
                    <g className="polygons">
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
                                    id={polygonId}
                                    key={polygonId}
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
