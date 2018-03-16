/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { TESSELATION_CREATE_MODE } from "../actions/actionTypes";
import {
    meshSetMeshAction,
    meshSetPolygonColorAction
} from "../actions/actionGenerators";

import { voronoiTesselation, ColorAverager } from "./tesselationCalculation";

type Props = {
    dispatch: (action: Object) => Object,
    patchId: string,
    selection: string,
    mode: string,
    sites: number[][],
    outline: number[][],
    rasterBase64: string
};

const mapStateToProps = ({
    currentTool: { mode, modeState },
    raster: { rasterBase64, width, height },
    selection,
    patches
}) => {
    const outline = patches[selection].outline;
    return {
        mode,
        patchId: selection,
        sites: modeState,
        outline,
        rasterBase64,
        width,
        height
    };
};
// prettier-ignore
// eslint-disable-next-line function-paren-newline
export const TesselationCreateControls = connect(mapStateToProps)(
    class extends React.Component<Props> {
        constructor(props) {
            super(props);

            this.onClick = this.onClick.bind(this);
            this.setMesh = this.setMesh.bind(this);
            this.setPolygonColor = this.setPolygonColor.bind(this);
        }

        onClick() {
            const {
                sites, outline, rasterBase64, width, height
            } = this.props;
            const sitesCrds = Object.values(sites).map(({ point }) => point);
            // eslint-disable-next-line max-len
            const outlineCrds = Object.values(outline.nodes).map(({ point }) => point);
            const { setMesh } = this;

            // Get uncolored tesselation
            const mesh = voronoiTesselation(sitesCrds, outlineCrds);
            const { nodes, polygons } = mesh;
            setMesh(nodes, polygons);

            // Calculate colors
            const colorAverager = new ColorAverager(rasterBase64, width, height);
            Object.entries(polygons).forEach(([polygonId, { nodeIds }]) => {
                const coords = nodeIds.map((nodeId) => nodes[nodeId].point);

                colorAverager
                    .getColor(coords)
                    .then((color) => {
                        this.setPolygonColor(polygonId, color);
                    })
                    .catch((error) => {
                    // eslint-disable-next-line no-console
                        console.log("Couldn't get a color for polygon " +
                                `${polygonId}. Setting to none.`);
                        throw error;
                    });
            });
        }

        setMesh(nodes, polygons) {
            const { dispatch, patchId } = this.props;
            dispatch(meshSetMeshAction(patchId, nodes, polygons));
        }

        setPolygonColor(polygonId, color) {
            const { dispatch, patchId } = this.props;
            dispatch(meshSetPolygonColorAction(patchId, polygonId, color));
        }

        render() {
            const { onClick } = this;

            return (
                <div
                    className={`${TESSELATION_CREATE_MODE}_controls`}
                >
                    <div className="numberPicker">
                        <label htmlFor="numberPickerInput">
                            Random Sites
                            <input id="numberPickerInput" type="number" />
                            <button>➡</button>
                        </label>
                    </div>

                    <button onClick={onClick}>Generate</button>
                </div>
            );
        }
    });
