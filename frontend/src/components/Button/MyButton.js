import React from "react";

function MyButton({ to }) {
    return (
        <a href={`/${to}`}>{to === '' ? "HOME" : to}</a>
    )
};
export default MyButton;