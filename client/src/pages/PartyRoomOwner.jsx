import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

function PartyRoomOwner() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/`);
    }

    if (navigator.share) {
      setCanShare(true);
    } else {
      setCanShare(false);
    }
  }, []);

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: 'FrameIt - Room',
          url: `http://localhost:3000/party/${id}/ph`,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
      handleCopyLink();
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/party/${id}/ph`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false)
    }, 3000);
  };

  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
      {isAuthenticated ? (
        <div className="qrWrap">
          <h3 className="removeDefaultStyling">Room #{id}</h3>
          <QRCodeSVG
            bgColor='transparent'
            id="dash-qr"
            size="130px"
            value={`http://localhost:3000/party/${id}/ph`}
          />
          <button className="mainButton" onClick={handleShare}>
            {canShare ? (
              <span>SHARE</span>
            ) : !copied ? (
              <span>COPY</span>
            ) : (
              <span>COPIED ✅</span>
            )}
          </button>
          <span></span>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default PartyRoomOwner;
