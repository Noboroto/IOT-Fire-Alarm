import React from "react";
import "./styles.css";

const NotPermit = () => {
    return (
        <div>
            <section className="error-container">
                <span className="four"><span className="screen-reader-text">4</span></span>
                <span className="zero"><span className="screen-reader-text">0</span></span>
                <span className="four"><span className="screen-reader-text">4</span></span>
            </section>
            <div className="link-container">
                <a target="_blank" href="/" className="more-link">Return Login Page</a>
            </div>
        </div>
    )
}

export default NotPermit