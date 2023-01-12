import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";
import '../styles/Home.css';

function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  function handleGohome() {
    navigate(`/`);
  } 

  return (
    <div className="navbar">
      <div className="logo">
        <img
          onClick={handleGohome}
          className="logoImg"
          src={process.env.PUBLIC_URL + '/assets/frameit.png'}
          alt="img"
        ></img>
      </div>
      {isAuthenticated ? (
        <div className="navButton" onClick={logout}>
          <button className="logButton">LOGOUT</button>
        </div>
      ) : (
        <div className="navButton" onClick={() => loginWithRedirect()}>
          <button className="logButton">LOGIN</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
