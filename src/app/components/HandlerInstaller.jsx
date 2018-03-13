/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */

import React from "react";

import * as d3 from "d3";

type EventHandler = (e: Event) => void;

type HandlerInfo = {
    element: Element,
    eventType: string,
    handler: EventHandler,
    modifiersWrapper: (fn: EventHandler) => EventHandler
};

type Props = { handlers: HandlerInfo[] };
export const HandlerInstaller = class extends React.Component<Props> {
    constructor(props) {
        super(props);

        this.listenedForEvents = [];
    }

    componentDidMount() {
        this.setUp();
    }

    componentWillUpdate() {
        this.tearDown();
    }

    componentDidUpdate() {
        this.setUp();
    }

    componentWillUnmount() {
        this.tearDown();
    }

    setUp() {
        this.installListeners();
    }

    // eslint-disable-next-line react/sort-comp
    tearDown() {
        this.uninstallListeners();
    }

    installListeners() {
        // Install listeners, then add to thie list of installed listeners
        this.props.handlers.forEach(({
            element, eventType, handler, modifiersWrapper
        }) => {
            this.listenedForEvents.push({ element, eventType });
            d3
                .select(element)
                .on(eventType, () => modifiersWrapper(handler)(d3.event));
        });
    }

    uninstallListeners() {
        if (this.listenedForEvents.length > 0) {
            const { element, eventType } = this.listenedForEvents.shift();
            d3.select(element).on(eventType, null);

            this.uninstallListeners();
        }
    }

    render() {
        return null;
    }
};
