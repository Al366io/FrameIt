import React from 'react';
import '../styles/Home.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Footer from '../components/Footer';

function Home() {
  const { isAuthenticated, loginWithRedirect, loginWithPopup } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/dashboard`);
    }
  });
  // TODO: HERE DO A: "JOIN A PARTY" BUTTON -> OPEN INPUT, you type in the code and you get redirected to that party room.
  // TODO: INSERT FOOTER WITH MY INFO
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
            <div className="slogan">
              <h1 className="removeDefaultStyling"> Frame It </h1>
              <h2 className="removeDefaultStyling"> Share It </h2>
              <button onClick={() => loginWithPopup()} className="logButton">
                LOGIN
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
        <Footer/>
      </div>
    </div>
  );
}

export default Home;
