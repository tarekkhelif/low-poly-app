/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import { App } from "./components/App";

const container = document.createElement("div");
document.body.appendChild(container);

const reducer = (state = {}, action) => state;
const store = createStore(reducer);

// const ConnectedApp = connect()(App);

ReactDOM.render(
    (
        <Provider store={store}>
            <App />
        </Provider>),
    container
);
