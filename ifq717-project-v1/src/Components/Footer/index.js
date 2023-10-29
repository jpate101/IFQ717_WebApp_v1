import React from "react";
import Student from "./Student";
//import ChatIcon from "./Chat.svg"
import "./footer.css";

const Footer = () => {
    return (
    <footer className="footer bg-background text-primary">
        <div className="footer-grid">
            <div className="footer-column">
                <div>
                    <p>&copy; 2023, &lt;team name&gt; </p>
                    <p>2 George St, < br/>
                    Brisbane QLD 4000</p>
                </div>
            </div>
        <div className="footer-column">
            <div>
                <p>IFQ717 Students:</p>
                <ul>
                    <Student name='Lizzy' githubUrl='https://github.com/LizGiglio' />
                    <Student name='Josh' githubUrl='https://github.com/jpate101' />
                    <Student name='Holly' githubUrl='https://github.com/holler4amarshall' />
                </ul>
            </div>
        </div>
        <div className="footer-column">
          <div>
            <div className="chat-icon-container">
            <p>Need support? < br/>
            <img src="/Chat.svg" alt="Chat Icon" className="chat-icon" />
            </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;