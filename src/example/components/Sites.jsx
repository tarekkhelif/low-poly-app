/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { SEED, DELETE, MOVE } from "../store/actions";

import { Nodes } from "./Node";

const Sites = ({ sites }) => {
    const allowedActions = {};
    allowedActions[DELETE] = true;
    allowedActions[MOVE] = true;
    return (<Nodes
        className={SEED}
        nodes={sites}
        allowedActions={allowedActions}
    />);
};

export const SitesConnector = connect((state) => ({
    sites: state[SEED]
}))(Sites);
