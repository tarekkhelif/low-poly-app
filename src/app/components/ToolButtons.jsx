/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import FileSaver from "file-saver";

import { camelize } from "../util/stringTools";

import { setRasterAction, changeToolAction } from "../actions/actionGenerators";
import {
    TOOL_EDIT_AN_OUTLINE,
    TOOL_EDIT_TESSELATIONS
} from "../actions/actionTypes";


function askUserForRaster() {
    return new Promise((resolve, reject) => {
        function onChange() {
            const file = this.files[0];
            const reader = new FileReader();
            reader.onload = () => { resolve(reader.result); };
            reader.onerror = (err) => { reject(err); };
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

const getRasterDimensions = (base64ImgURL) => {
    const dimensions = new Promise((resolve, reject) => {
        const htmlImg = new Image();

        htmlImg.onload = () => {
            const { width, height } = htmlImg;
            resolve({ width, height });
        };
        htmlImg.onerror = (err) => reject(err);

        htmlImg.src = base64ImgURL;
    });

    return dimensions;
};

function exportArt(/* state */) {
    // const svg = <Art state={state}/>;
    const svg = document.querySelector(".workspace");
    const data = (new XMLSerializer()).serializeToString(svg);
    const svgFile = new File([data], { type: "image/svg+xml;charset=utf-8" });
    FileSaver.saveAs(svgFile, "low-poly-project.svg");
}

export const ToolButtons = connect()(({ dispatch }) => {
    const tools = [
        {
            label: "Import Image",
            onClick: async () => {
                const raster = await askUserForRaster();
                const { width, height } = await getRasterDimensions(raster);
                dispatch(setRasterAction(raster, width, height));
            }
        },
        {
            label: "Outline",
            onClick: () => dispatch(changeToolAction(TOOL_EDIT_AN_OUTLINE))
        },
        {
            label: "Edit Tesselation",
            onClick: () => dispatch(changeToolAction(TOOL_EDIT_TESSELATIONS))
        },
        {
            label: "Save Art",
            onClick: () => { exportArt(); }
        }
    ];

    return (
        <div className="toolButtons">
            {
                tools.map(({ label, onClick }) => {
                    const id = camelize(label);
                    return (
                        <button
                            key={id}
                            id={id}
                            className="toolButton"
                            onClick={onClick}
                        >
                            {label}
                        </button>);
                })
            }
        </div>
    );
});
