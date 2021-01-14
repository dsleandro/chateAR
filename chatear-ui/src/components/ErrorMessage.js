import React from "react";

function ErrorMessage(props) {
    return (
        <div className="errorMessage">{props.message}</div>
    )
}

export {ErrorMessage};