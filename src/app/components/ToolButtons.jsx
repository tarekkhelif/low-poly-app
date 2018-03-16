/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import FileSaver from "file-saver";

import { camelize } from "../util/stringTools";

import { setRasterAction, changeToolAction } from "../actions/actionGenerators";
import { OUTLINE_TOOL, TESSELATION_TOOL } from "../actions/actionTypes";

const mapStateToProps = ({ currentTool: { tool } }) => ({ tool });
export const ToolButtons = connect(mapStateToProps)(({ dispatch, tool }) => {
    const tools = [
        {
            label: "Import Image",
            className: "toolButton",
            onClick: async () => {
                dispatch(changeToolAction(null));

                const raster = await askUserForRaster();
                const { nativeWidth, nativeHeight } = await getRasterDimensions(raster);
                const { width, height } = scaleDimensions(
                    nativeWidth,
                    nativeHeight
                );

                dispatch(setRasterAction(raster, width, height));
            }
        },
        {
            label: "Outline",
            className: `toolButton${tool === OUTLINE_TOOL ? " active" : ""}`,
            onClick: () => dispatch(changeToolAction(OUTLINE_TOOL))
        },
        {
            label: "Edit Tesselation",
            className: `toolButton${
                tool === TESSELATION_TOOL ? " active" : ""
            }`,
            onClick: () => dispatch(changeToolAction(TESSELATION_TOOL))
        },
        {
            label: "Save Art",
            className: "toolButton",
            onClick: () => {
                dispatch(changeToolAction(null));

                exportArt();
            }
        }
    ];

    return (
        <div className="toolButtons">
            {tools.map(({ label, className, onClick }) => {
                const id = camelize(label);
                return (
                    <button
                        key={id}
                        id={id}
                        className={className}
                        onClick={onClick}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
});

function askUserForRaster() {
    return new Promise((resolve, reject) => {
        function onChange() {
            const file = this.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (err) => {
                reject(err);
            };
            reader.readAsDataURL(file);
        }

        const rasterInput = document.createElement("input");
        rasterInput.type = "file";
        rasterInput.id = "rasterInput";
        rasterInput.accept = "image/*";
        rasterInput.style = "display:none";
        rasterInput.onchange = onChange;

        rasterInput.click();
    });
}

function getRasterDimensions(base64ImgURL) {
    const dimensions = new Promise((resolve, reject) => {
        const htmlImg = new Image();

        htmlImg.onload = () => {
            const { width, height } = htmlImg;
            resolve({ nativeWidth: width, nativeHeight: height });
        };
        htmlImg.onerror = (err) => reject(err);

        htmlImg.src = base64ImgURL;
    });

    return dimensions;
}

function scaleDimensions(fullWidth, fullHeight) {
    if (fullWidth === 0 || fullHeight === 0) {
        throw new Error("Dimensions must be nonzero");
    }

    const width = 600;
    const height = fullHeight / fullWidth * width;

    return { width, height };
}

function exportArt(/* state */) {
    // const svg = <Art state={state}/>;
    const svg = document.querySelector(".workspace");
    const data = new XMLSerializer().serializeToString(svg);
    const svgFile = new File([data], { type: "image/svg+xml;charset=utf-8" });
    FileSaver.saveAs(svgFile, "low-poly-project.svg");
}
