/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return (
            <div className="app">
                <ControlPane stages={[]} />;
                <Workspace appState={{}} />
            </div>
        );
    }
}

class ControlPane extends React.Components {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return (
            <div className="controlPane">
                <StageSelector />;
                <StageTools />;
            </div>
        );
    }
}

class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return (
            <div className="workspace">
                <Svg />;
            </div>
        );
    }
}

class Svg extends React.Components {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return (
            <svg className="svg">
                <Art />;
                <Ui />;
            </svg>
        );
    }
}

class Art extends React.Components {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return (
            <g className="art">
                <image src={this.props.appState.exampleData.rasterURL} />
                <Polygons polygons={[]} />;
            </g>
        );
    }
}

class Polygons extends React.Components {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return <div />;
    }
}

class Ui extends React.Components {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return (
            <g className="ui">
                <Outline outlineData={this.props.appState.outlineData} />
                <Sites sitesData={[]} /> {/* TODO: */}
                <Mesh meshData={[]} /> {/* TODO: */}
            </g>
        );
    }
}

class Outline extends React.Components {
    constructor(props) {
        super(props);
        this.justExists = "justExists";
    }

    render() {
        return (
            <g>
                <path pathCoords={[]} /> {/* TODO: */}
            </g>
        );
    }
}

ReactDOM.render(<App />, document.body);
