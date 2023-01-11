import React from "react";
import "../styles/Home.css";
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  return (
    <div className="App">
      <div className="homeWrapper">
        <navbar className="navbar">
          <div className="logo">LOGO</div>
          {isAuthenticated ? (
            <div className="navButton" onClick={logout}>logout</div>
          ) : (
            <div className="navButton" onClick={() => loginWithRedirect()}>login</div>
          )}
        </navbar>
        <div className="bodyWrapper">
          <div className="firstHalf">
            {isAuthenticated? <div> Hi, {user.name} </div> : ''}
            To let everyone at the party be the Photographer!
          </div>
          <div className="secondHalf">
            <ul className="list">
              <li>Create a Party</li>
              <li>Send everybody the link</li>
              <li>Let people send photos in real time</li>
              <li>Enjoy your memories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
