import React from 'react';
import { useParams } from 'react-router-dom';
// import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

function Dashboard() {
  const { id } = useParams();
  // const [copied, setCopied] = useState(false);

  // const handleCopyLink = () => {
  //   navigator.clipboard.writeText(`http://localhost:3000/adder/${id}`);
  //   setCopied(true);
  // };

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'FrameIt - Room',
        url: `https://frame-it.vercel.app/dashboard/${id}`
      }).then(() => {
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
      <div className="firstHalf">
        <h3 className="removeDefaultStyling">Room #{id}</h3>
        <QRCodeSVG
          id="dash-qr"
          size="200px"
          value={`http://localhost:3000/adder/${id}`}
        />
        <button className="button-dash" onClick={handleShare}>
          <span>SHARE</span>
        </button>
        <span></span>
      </div>
    </div>
  );
}

export default Dashboard;
