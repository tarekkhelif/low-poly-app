/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { SEED } from "../store/actions";

import { Nodes } from "./Node";

const Sites = ({ sites }) => <Nodes className={SEED} nodes={sites} />;

export const SitesConnector = connect((state) => ({
    sites: state[SEED]
}))(Sites);
