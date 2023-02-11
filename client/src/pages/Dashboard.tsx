import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
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
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0();

  const [partyId, setPartyId] = useState('');
  const [isUp, setIsUp] = useState(1);
  const [askConfirm, setAskConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/`);
    }
  }, [isAuthenticated, navigate]);

  const { isLoading, isError } = useQuery('create owner', async () => {
    if (user && user.email) {
      const result = await createOwner(user.email);
      setIsUp(result);
      const partyId = await checkForParty(user.email);
      if (partyId) setPartyId(partyId);
      if (result !== 1) {
        throw new Error('Network error');
      } else {
        return;
      }
    }
  });

  if (isError) {
    return <span>Error</span>;
  }

  const handleCreate: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    const partyId = await createParty(user?.email as string);
    if (partyId) {
      navigate(`/party/${partyId}`);
    }
  };

  const handleRedirect = () => {
    if (partyId) {
      navigate(`/party/${partyId}`);
    }
  };

  const confirm = () => {
    setAskConfirm(true);
  };

  const handleDelete = async () => {
    setAskConfirm(false);
    const done = await deleteParty(partyId);
    if (done === 'Not Found') {
      return;
    }
    setPartyId('');
    return;
  };

  return (
    <div className="App">
      <div className="dashboardWrapper">
        <Navbar></Navbar>
        {isLoading ? (
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
                    <div className="hello"> Hello, {user?.given_name} ! </div>
                  ) : (
                    ''
                  )}
                  {isAuthenticated ? (
                    partyId ? (
                      <div className="dashButtons">
                        <button className="mainButton" onClick={handleRedirect}>
                          GO TO UR PARTY
                        </button>
                        <button
                          className={
                            askConfirm ? 'mainButton invisible' : 'mainButton'
                          }
                          onClick={confirm}
                        >
                          DELETE CURRENT PARTY
                        </button>
                        <div
                          className={
                            askConfirm ? 'askConfirm' : 'invisible askConfirm'
                          }
                        >
                          ARE YOU SURE?
                          <div className="wrapConfirm">
                            <button
                              className="confirmYes vibrate"
                              onClick={handleDelete}
                            >
                              YES
                            </button>
                            <button
                              className="confirmNo"
                              onClick={() => setAskConfirm(false)}
                            >
                              NO
                            </button>
                          </div>
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
                  <div className="navButton" onClick={() => logout()}>
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
