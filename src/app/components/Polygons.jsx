/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

    import React from "react";
    import { connect } from "react-redux";
    
    const mapStateToProps = ({ patches }, { patchId }) => ({
        outlineNodes: patches[patchId]
    });
    export const Outline = connect(mapStateToProps)(
