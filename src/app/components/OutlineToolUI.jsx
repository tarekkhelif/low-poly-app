/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

const mapStateToProps = ({ patches }) => ({ patches });
export const OutlineToolUI = connect(mapStateToProps)(({ patches }) => (
    <g className="outlineToolUI">
        {
            Object.entries(patches).map(([patchId, { outline: { nodes } }]) => {
                const outlinePoints = Object.entries(nodes)
                    .map(([nodeId, { point }]) => point);

                const pathString = outlinePoints.length > 0
                    ? `M${outlinePoints.join("L")}Z`
                    : "";

                return (
                    <path
                        key={patchId}
                        id={patchId}
                        className="outline"
                        d={pathString}
                    />
                );
            })
        }
    </g>));
