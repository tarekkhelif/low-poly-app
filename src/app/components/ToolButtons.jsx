/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

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

export const ToolButtons = connect()(({ dispatch }) => {
    const tools = [
        {
            label: "Import Image",
            onClick: async () => {
                const raster = await askUserForRaster();
                dispatch(setRasterAction(raster));
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
            onClick: () => { }
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
    )
});
