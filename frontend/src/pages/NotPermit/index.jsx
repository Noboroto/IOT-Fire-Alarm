import React from "react";
import "./styles.css";

const NotFound = () => {
    return (
        <div className="wrapper">
            <div className="box">
                <h1>403</h1>
                <p>Sorry, it's not allowed to go beyond this point!</p>
                <p><a href="/">Please, go back this way.</a></p>
            </div>
        </div>
    )
}

export default NotFound