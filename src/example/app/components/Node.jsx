// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types
    react/require-default-props */
import React from "react";

type NodeProps = {
    className: string,
    point: number[],
    id: string,
    onMouseDown?: (e: Event) => void
};

export const Node = ({
    className, point, id, onMouseDown
}: NodeProps) => (
    <circle
        className={className}
        id={id}
        cx={point[0]}
        cy={point[1]}
        onMouseDown={onMouseDown}
    />
);
