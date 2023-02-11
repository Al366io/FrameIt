import React from 'react';
import '../styles/Dashboard.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footerInfo">
        <p>This App is being developed as a personal project.</p>
        <p>Feel free to make contributions or contact me at:</p>
      </div>
      <div className="footerLinks">
      <a href='https://github.com/Al366io'>
          <img
            className="icon"
            src={process.env.PUBLIC_URL + '/assets/githubIcon.png'}
            alt="logo"
          ></img>
        </a>
        <a href='https://www.linkedin.com/in/alessio-nannipieri-a27550218/'>
          <img
            className="icon"
            src={process.env.PUBLIC_URL + '/assets/linkedinIcon.png'}
            alt="icon"
          ></img>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
