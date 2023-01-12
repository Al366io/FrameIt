import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

// reachable at /party/:id/ph
function JoinRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  function handleRedirect() {
    navigate(`/party/${id}/ph/add`);
  }

  return (
    <div className="App">
      <div className="homeWrapper">
        <div className="bodyWrapper">
          <div className="terrence">
            <div className="logo">
              <img
                className="logoImg"
                src={process.env.PUBLIC_URL + '/assets/FRAMEIT_icon.png'}
                alt="img"
              ></img>
            </div>
            <div className="welcome">
              <h1 className="removeDefaultStyling"> Frame It </h1>
              <h2 className="removeDefaultStyling"> Share It </h2>
              {/* <button onClick={() => handleRedirect()} className="logButton">
                Join With Google
              </button> */}
              <button onClick={() => handleRedirect()} className="logButton">
                Join As Guest
              </button>
            </div>
          </div>
          <div className="infoApp">
            <span>Create a Party</span>
            <span>Send everybody the link</span>
            <span>Let people send photos in real time</span>
            <span>Enjoy your memories</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
