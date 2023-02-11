import { checkRoom } from '../ApiServices';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useQuery } from 'react-query';
import PhotosGrid from '../components/PhotosGrid';
import Navbar from '../components/Navbar';

import '../styles/Dashboard.css';
import '../styles/animations.css';

const { REACT_APP_BACKEND_HOST } = process.env;

function PartyRoomOwner() {
  const { partyId } = useParams();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const navigate = useNavigate();
  const [roomExists, setRoomExists] = useState(true);
  const { isAuthenticated } = useAuth0();

  const { isLoading, isError } = useQuery('check if room exists', async () => {
    const exist = await checkRoom(partyId ?? '');
    if (exist.exists) {
      setRoomExists(exist.exists);
      return;
    } else {
      throw new Error('The room does not exist');
    }
  });

  useEffect(() => {
    if (navigator) {
      setCanShare(true);
    } else {
      setCanShare(false);
    }
    if (!isAuthenticated) {
      navigate(`/`);
    }
  }, [isAuthenticated, navigate]);

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: 'FrameIt - Room',
          url: `${REACT_APP_BACKEND_HOST}/party/${partyId}/ph`,
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
    navigator.clipboard.writeText(`http://localhost:3000/party/${partyId}/ph`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const goToPh = () => {
    navigate(`/party/${partyId}/ph/add`);
  };

  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
      {isAuthenticated && roomExists && !isLoading && !isError ? (
        <>
          <div className="qrWrap">
            <h3 className="removeDefaultStyling">Room #{partyId}</h3>
            <QRCodeSVG
              bgColor="transparent"
              id="dash-qr"
              size={130}
              value={`http://localhost:3000/party/${partyId}/ph`}
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
          <div className="secondHalf">{<PhotosGrid id={partyId ?? ''} />}</div>
        </>
      ) : (
        <h1>Wrong Party :C</h1>
      )}
    </div>
  );
}

export default PartyRoomOwner;
