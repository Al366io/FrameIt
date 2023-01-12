import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { createOwner, createParty, checkForParty, deleteParty } from '../ApiServices';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0();
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

    if (!isAuthenticated) {
      navigate(`/`);
    }
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const id = await createParty(user.email);
    if (id) {
      navigate(`/party/${id}`);
    }
  };

  const handleRedirect = () => {
    if (partyId) {
      navigate(`/party/${partyId}`);
    }
  };
  const handleDelete = async () => {
    const done = await deleteParty(partyId);
    if(done == 'Not Found') {
      return;
    }
    setPartyId('')
    return;
  };

  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
      <div className="firstHalfDash">
        {isAuthenticated ? (
          <div className="hello"> Hello, {user.given_name} ! </div>
        ) : (
          ''
        )}
        {isAuthenticated ? (
          partyId ? (
            <div className='dashButtons'>
              <button className="mainButton" onClick={handleRedirect}>
                GO TO UR PARTY
              </button>
              <button className="mainButton" onClick={handleDelete}>
                DELETE CURRENT PARTY
              </button>
            </div>
          ) : (
            <button onClick={handleCreate} className="logButton">
              CREATE A PARTY 📸
            </button>
          )
        ) : (
          ''
        )}
      </div>
      <div className="secondHalfDash"></div>
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

export default Dashboard;
