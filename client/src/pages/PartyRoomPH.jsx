import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import ImagePreview from '../components/ImagePreview';

// reachable at /party/:id/ph/add
function PartyRoomPH() {
  const { id } = useParams();
  const [dataUri, setDataUri] = useState('');
  const [openCamera, setOpenCamera] = useState(false);

  const handleTakePhoto = async (dataUri) => {
    // if (dataUri) {
    //   setPhoto(dataUri);
    //   const imageSize = await getImageSize(dataUri);
    //   setImageSize(imageSize);
    //   setUseCamera(false);
    // }
  };

  function sendIt() {
    //
  }

  function toggleCamera() {
    setOpenCamera(!openCamera);
  }

  return (
    <div className="dashboardWrapper">
      <div className="firstHalf">
        {' '}
        ROOM #{id}
        {/* <button onClick={toggleCamera} className="logButton">
          Open Camera 📸
        </button> */}
        <form method="post" enctype="multipart/form-data" id="formSend" onSubmit={sendIt}>
          <div className='fotoWrap'>
          <label for="foto" class="customFoto">
            📸
          </label>
          <label>Click to take Photo</label>
          </div>
          <input id="foto" type="file" name="image" capture="enviroment" accept="image/*"/>
          <button className="logButton" type="submit">SEND</button>
          {/* <button class="apriCamera" onclick={document.getElementById('foto').click()}> 📷 </button> */}
        </form>
      </div>
    </div>
  );
}

export default PartyRoomPH;
