import React from "react";

function UserCircle() {
    return (
        <i role="img" aria-label="User icon" className="fas fa-user-circle" style = {{ fontSize: 1.7 + "em" }}></i>
    )
}

function Spinner() {
    return(
    <i role="img" aria-hidden="true" className="fas fa-spinner fa-spin"></i>
    )
}

function SignOutIcon() {
    return (
        <i className="fas fa-sign-out-alt" ></i>
    )
}

function PaperPlane() {
    return(
    <i role="img" aria-hidden="true" className="fas fa-paper-plane"></i>
    )
}

function UserIcon() {
    return(
        <i role="img" aria-hidden="true" className="fa fa-user fa-fw"></i>
    )
}

function SettingsIcon() {
    return(
        <i role="img" aria-hidden="true" className="fa fa-cog fa-fw"></i>
    )
}

export { Spinner, UserCircle, SignOutIcon, PaperPlane, UserIcon, SettingsIcon };