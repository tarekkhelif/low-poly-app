/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import { connect } from "react-redux";

import { Patch } from "./Patch";

// const mapStateToProps = ({ patches }) => ({
//     patchIDs: patches.map(({ id }) => id)
// });
// export const DefaultToolUI = connect(mapStateToProps)(({ patchIDs }) => (
//     <g className="patches">
//         {patchIDs.map(([id]) => (
//             <Patch key={id} id={id} />
//         ))}
//     </g>
// ));

export const DefaultToolUI = () => <g className="defaultToolUI" />;
