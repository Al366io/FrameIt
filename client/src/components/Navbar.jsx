import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  function handleGohome() {
    navigate(`/`);
  }

  return (
    <div className="navbar">
      <a className='aLogo'>
      <img
        width={"180px"}
        onClick={handleGohome}
        src={process.env.PUBLIC_URL + '/assets/FRAMEIT_logo.png'}
        alt="img"
      ></img>
      </a>
    </div>
  );
}

export default Navbar;
