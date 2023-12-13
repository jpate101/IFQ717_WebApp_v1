import React from "react";
import Student from "./Student";
//import ChatIcon from "./Chat.svg"
import "./footer.css";

const Footer = () => {
    return (
    <footer className="footer text-primary">
        <div className="footer-grid">
            <div className="footer-column">
                <div className="ml-2">
                    <p>< br/>&copy; 2023, Tanda Launchpad </p>
                    <p>2 George St, < br/>
                    Brisbane QLD 4000</p>
                </div>
            </div>
            <div className="footer-column flex flex-col items-center justify-center">
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
            <div className="text-right mr-2">
            <p>< br/>
            Student project < br/>
            QUT Web Development Bootcamp < br/>
            Built with React, Node.js upon Tanda APIs
            </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;