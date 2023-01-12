import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { createOwner, createParty, checkForParty } from '../ApiServices';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();
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

  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
      <div className="firstHalf">
        {isAuthenticated ? <div> Hi, {user.name} </div> : ''}
        {isAuthenticated ? (
          partyId ? (
            <button className="createParty" onClick={handleRedirect}>
              Go to ur party
            </button>
          ) : (
            <button onClick={handleCreate} className="createParty">
              Create a Party 📸
            </button>
          )
        ) : (
          ''
        )}
      </div>
      <div className="secondHalf">
      <span>To let everyone at the party be the Photographer!</span>
        <span>HOW IT WORKS: </span>
        <ul className="list">
          <li>Create a Party</li>
          <li>Send everybody the link</li>
          <li>Let people send photos in real time</li>
          <li>Enjoy your memories</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
