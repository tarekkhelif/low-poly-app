// @flow

/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { moveNodeAction } from "../store/tesselationActions";
import { Polygon } from "./Polygon";
import { Node } from "./Node";
