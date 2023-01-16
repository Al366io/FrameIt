import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
  createOwner,
  createParty,
  checkForParty,
  deleteParty,
} from '../ApiServices';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import { MagnifyingGlass } from 'react-loader-spinner';

function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0();
  const [partyId, setPartyId] = useState('');
  const [isUp, setIsUp] = useState(1);
  const [loading, setLoading] = useState(true);
  const [askConfirm, setAskConfirm] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    async function fetchData() {
      if (isAuthenticated) {
        const up = await createOwner(user.email);
        setIsUp(up);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        if (isUp) {
          const partyId = await checkForParty(user.email);
          if (partyId) setPartyId(partyId);
        }
      }
    }
    fetchData();
    setTimeout(() => {
      if (!isAuthenticated) {
        navigate(`/`);
      }
    }, 500);
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
  const confirm = () => {
    setAskConfirm(true);
  }
  const handleDelete = async () => {
    setAskConfirm(false);
    const done = await deleteParty(partyId);
    if (done == 'Not Found') {
      return;
    }
    setPartyId('');
    return;
  };
  return (
    <div className="App">
      <div className="dashboardWrapper">
        <Navbar></Navbar>
        {loading ? (
          <div className="loaderWrap">
            <MagnifyingGlass
              visible={true}
              height="90"
              width="90"
              ariaLabel="MagnifyingGlass-loading"
              wrapperStyle={{}}
              wrapperClass="MagnifyingGlass-wrapper"
              glassColor="#ecbef7"
              color="#8139d1"
            />
          </div>
        ) : (
          <>
            {!isUp ? (
              <div className="firstHalfDash">
                <h2>Our Server is 📉</h2>
              </div>
            ) : (
              <>
                <div className="firstHalfDash">
                  {isAuthenticated ? (
                    <div className="hello"> Hello, {user.given_name} ! </div>
                  ) : (
                    ''
                  )}
                  {isAuthenticated ? (
                    partyId ? (
                      <div className="dashButtons">
                        <button className="mainButton" onClick={handleRedirect}>
                          GO TO UR PARTY
                        </button>
                        <button className="mainButton" onClick={handleDelete}>
                          DELETE CURRENT PARTY
                        </button>
                        <div className={askConfirm ? 'askConfirm' : 'invisible askConfirm'}>
                          ARE YOU SURE?
                          <button className='confirmYes'>YES</button>
                          <button className='confirmNo'>NO</button>
                        </div>
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
                  <div
                    className="navButton"
                    onClick={() => loginWithRedirect()}
                  >
                    <button className="logButton">LOGIN</button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
