import React from 'react';
import '../styles/Home.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { createOwner, createParty, checkForParty } from '../ApiServices';
import { useState } from 'react';

function Home() {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [partyId, setPartyId] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (isAuthenticated) {
        await createOwner(user.email);
        const partyId = await checkForParty(user.email);
        if (partyId) setPartyId(partyId);
      }
    }
    fetchData();
  }, [isAuthenticated]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const id = await createParty(user.email);
    if (id) {
      navigate(`/dashboard/${id}`);
    }
  };

  const handleRedirect = () => {
    if (partyId) {
      navigate(`/dashboard/${partyId}`);
    }
  }

  return (
    <div className="App">
      <div className="homeWrapper">
        <Navbar></Navbar>
        <div className="bodyWrapper">
          <div className="firstHalf">
            {isAuthenticated ? <div> Hi, {user.name} </div> : ''}
            {isAuthenticated ? (
              partyId ? (
                <button className="createParty" onClick={handleRedirect}>Go to ur party</button>
              ) : (
                <button onClick={handleCreate} className="createParty">
                  Create a Party 📸
                </button>
              )
            ) : (
              ''
            )}
            <span>To let everyone at the party be the Photographer!</span>
          </div>
          <div className="secondHalf">
            <span>HOW IT WORKS: </span>
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
