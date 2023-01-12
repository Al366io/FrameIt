import React from 'react';
import '../styles/Home.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useState } from 'react';

function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/dashboard`);
    }
  });

  return (
    <div className="App">
      <div className="homeWrapper">
        <div className="bodyWrapper">
          <div className="logo">
            <img
              className="logoImg"
              src={process.env.PUBLIC_URL + '/assets/frameit.png'}
              alt="img"
            ></img>
          </div>
          <div className="navButton" onClick={() => loginWithRedirect()}>
            <button className="logButton">LOGIN</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
