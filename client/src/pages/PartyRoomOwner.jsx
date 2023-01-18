import React from 'react';
import { checkRoom } from '../ApiServices'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import PhotosGrid from '../components/PhotosGrid';
import Navbar from '../components/Navbar';

import '../styles/Dashboard.css';
import '../styles/animations.css';

function PartyRoomOwner() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const navigate = useNavigate();
  const [roomExists, setRoomExists] = useState(false);
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/`);
    }

    async function fetchRoom(){
      const exist = await checkRoom(id)
      setRoomExists(exist);
    }
    fetchRoom();
    
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
          url: `https://frame-it.vercel.app/party/${id}/ph`,
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
    navigator.clipboard.writeText(`https://frame-it.vercel.app/party/${id}/ph`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const goToPh = () => {
    navigate(`/party/${id}/ph/add`);
  };

  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
      {(isAuthenticated && roomExists)? (
        <>
          <div className="qrWrap">
            <h3 className="removeDefaultStyling">Room #{id}</h3>
            <QRCodeSVG
              bgColor="transparent"
              id="dash-qr"
              size="130px"
              value={`https://frame-it.vercel.app/party/${id}/ph`}
            />
            <button className="mainButton" onClick={handleShare}>
              {canShare ? (
                <span>SHARE</span>
              ) : !copied ? (
                <span>COPY 🔖</span>
              ) : (
                <span>COPIED ✅</span>
              )}
            </button>
            <button className="mainButton" onClick={goToPh}>
              TAKE PICS FOR UR PARTY
            </button>
          </div>
          <div className="secondHalf">
            <PhotosGrid id={id} />
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default PartyRoomOwner;
