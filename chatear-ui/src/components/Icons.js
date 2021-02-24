import React from "react";

function UserCircle() {
    return (
        <i role="img" aria-label="User icon" className="fas fa-user-circle"></i>
    )
}

function Spinner() {
    return (
        <i role="img" aria-hidden="true" className="fas fa-spinner fa-spin"></i>
    )
}

function LogoutIcon() {
    return (
        <i className="fas fa-sign-out-alt" ></i>
    )
}

function PaperPlane() {
    return (
        <i role="img" aria-hidden="true" className="fas fa-paper-plane"></i>
    )
}

function ContactsIcon() {
    return (
        <i role="img" aria-hidden="true" className="fa fa-address-book"></i>
    )
}

function SettingsIcon() {
    return (
        <i role="img" aria-label="Settings" className="fa fa-cog"></i>
    )
}

function ChatIcon() {
    return (
        <i role="img" aria-label="Settings" className="fa fa-comments"></i>
    )
}

function StarIcon() {
    return (
        <i role="img" aria-label="Add User" className="fa fa-star"></i>
    )
}

function DotsMenu() {
    return (
        <i role="img" aria-label="Add User" className="fa fa-ellipsis-v"></i>
    )
}

export { Spinner, UserCircle, LogoutIcon, PaperPlane, ContactsIcon, SettingsIcon, ChatIcon, StarIcon, DotsMenu };