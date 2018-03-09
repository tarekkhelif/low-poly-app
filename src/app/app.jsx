/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import { reducer } from "./reducer/reducer";
import { ConnectedApp } from "./components/App";

const container = document.createElement("div");
document.body.appendChild(container);

const store = createStore(reducer);

// const ConnectedApp = connect()(App);

ReactDOM.render(
    (
        <Provider store={store}>
            <ConnectedApp />
        </Provider>),
    container
);
