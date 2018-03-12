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

export const OutlineToolPatch = class extends React.Component<Props> {
    componentDidMount() {
        this.installListeners();
    }

    componentWillUpdate() {
        this.uninstallListeners();
    }

    componentDidUpdate() {
        this.installListeners();
    }

    componentWillUnmount() {
        this.uninstallListeners();
    }

    installListeners() {
        const { patchElement } = this;
        const { patchEventHandler } = this.props;

        // Handlers to un/install in `componentDidMout` / `componentWillUnmount`
        this.handlers = [
            {
                // This patch
                element: patchElement,
                event: "mousedown.outlineTool.patch",
                handler: () =>
                    executeOnPlainMouseDown(patchEventHandler)(d3.event)
            }
        ];

        // Install listeners
        this.handlers.forEach(({ element, event, handler }) =>
            d3.select(element).on(event, handler));
    }

    uninstallListeners() {
        // Uninstall listeners
        this.handlers.forEach(({ element, event }) =>
            d3.select(element).on(event, null));
    }

    render() {
        const { patchId, outline, selected } = this.props;

        return (
            <g
                id={patchId}
                className="patch"
                ref={(patchElement) => {
                    this.patchElement = patchElement;
                }}
            >
                <Outline
                    id={`${patchId}-outline`}
                    selected={selected}
                    outline={outline}
                />
                <OutlineNodes patchId={patchId} selected={selected} />
            </g>
        );
    }
};
