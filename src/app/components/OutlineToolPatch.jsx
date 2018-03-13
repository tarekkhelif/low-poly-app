/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";

import * as d3 from "d3";

import { executeOnPlainMouseDown } from "../util/eventTools";

import { Outline } from "./Outline";
import { OutlineNodes } from "./OutlineNodes";

type Props = {
    patchId: string,
    outline: Object,
    selected: boolean,
    patchEventHandler: (e: Event) => void
};

export const OutlineToolPatch = ({
    patchId,
    outline,
    selected,
    patchEventHandler
}: Props) => (
    <g
        id={patchId}
        className="patch"
        onMouseDown={executeOnPlainMouseDown(patchEventHandler)}
    >
        <Outline
            id={`${patchId}-outline`}
            selected={selected}
            outline={outline}
        />
        <OutlineNodes patchId={patchId} selected={selected} />
    </g>
);
