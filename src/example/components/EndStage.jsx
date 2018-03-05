/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import React from "react";
import { connect } from "react-redux";

import { killStageAction } from "../store/actions";

const mapStateToProps = (state) => ({ active: state.active });
export const EndStage = connect(mapStateToProps)(({ active, dispatch }) => (
    <div className="endStage">
        <button
            id="endStageButton"
            disabled={!active}
            onClick={() => { dispatch(killStageAction()); }}
        >
            Done with Seeds
        </button>
    </div>
));
