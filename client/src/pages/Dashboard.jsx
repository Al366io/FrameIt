import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
// import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

function Dashboard() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth0();
  // const [copied, setCopied] = useState(false);

  // const handleCopyLink = () => {
  //   navigator.clipboard.writeText(`http://localhost:3000/adder/${id}`);
  //   setCopied(true);
  // };

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: 'FrameIt - Room',
          url: `https://frame-it.vercel.app/dashboard/${id}`,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
      console.log('nooo');
    }
  }

  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
      {isAuthenticated ? (
        <div className="qrWrap">
          <h3 className="removeDefaultStyling">Room #{id}</h3>
          <QRCodeSVG
            id="dash-qr"
            size="130px"
            value={`http://localhost:3000/adder/${id}`}
          />
          <button className="buttonShare" onClick={handleShare}>
            SHARE
          </button>
          <span></span>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default Dashboard;
