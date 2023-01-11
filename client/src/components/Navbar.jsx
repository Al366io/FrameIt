import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";

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
          LOGOUT
        </div>
      ) : (
        <div className="navButton" onClick={() => loginWithRedirect()}>
          LOGIN
        </div>
      )}
    </div>
  );
}

export default Navbar;
