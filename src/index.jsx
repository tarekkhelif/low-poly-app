/**
 * @file Runs an prototype of a web app that helps users to quickly
 *     create low-poly graphics from a preexisting raster image.
 *     This prototype uses example data from file, and doesn't have any user
 *     interaction features.
 * @author Tarek Khelif
 */

/* @flow */

import React from "react";
import ReactDOM from "react-dom";

import "./style.scss";

import { LowPolyProject } from "./example/app.js";

const app = new LowPolyProject();
// app.runExample();
app.setUpUI();
