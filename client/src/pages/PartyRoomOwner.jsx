import React from 'react';
import { getSocketRoomId } from '../ApiServices';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import { io } from 'socket.io-client';
import '../styles/Dashboard.css';
import { MagnifyingGlass } from 'react-loader-spinner';

function PartyRoomOwner() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const { isAuthenticated, user } = useAuth0();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    if (!isAuthenticated) {
      navigate(`/`);
    }

    if (navigator.share) {
      setCanShare(true);
    } else {
      setCanShare(false);
    }

    const socket = io('https://www.frameit.social');
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 3000);
    });

    async function fetchSocketRoomId() {
      const socketRoomId = await getSocketRoomId(id);
      socket.emit('join-room', socketRoomId);
    }
    fetchSocketRoomId();

    socket.on('pics', (data) => {
      setPhotos(data);
    });
  }, []);

  /*
  Here you:
  1. get the array of photos from the database (socket.io) 
  2. map it, displaying a photo component for every one of them 
  */

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
      {isAuthenticated ? (
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
            <div className="container">
              {!photos.length ? (
                <h3>No pics for now</h3>
              ) : (
                <div className="gridContainer">
                  {photos.map((pic, idx) => {
                    return <img className="gridItem" key={idx} src={pic}></img>;
                  })}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default PartyRoomOwner;
