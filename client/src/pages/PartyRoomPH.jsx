import React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { sendImage } from '../ApiServices';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/Dashboard.css';
import 'react-html5-camera-photo/build/css/index.css';

// reachable at /party/:id/ph/add
function PartyRoomPH() {
  const fileReader = new FileReader();
  const { id } = useParams();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [something, setSomething] = useState('');

  const generateRandomString = function (length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  async function sendIt(e) {
    e.preventDefault();
    const input = document.getElementById('foto');
    alert('size:', input.files[0].size)
    await sendImage(input.files[0], id);
    alert('Sent :D');
    input.value = null;
    setSomething(false);
    setFileUploaded(false);
  }

  function handleChange() {
    const input = document.getElementById('foto');
    let buff = input.files[0];
    if (buff) {
      setFileUploaded(true);
      fileReader.readAsDataURL(buff);
      fileReader.addEventListener('load', function () {
        setSomething(this.result);
      });
    } else setFileUploaded(false);
  }

  return (
    <div className="dashboardWrapper">
      <div className="firstHalf">
        {' '}
        ROOM #{id}
        <form id="formSend" onSubmit={sendIt}>
          <div className="fotoWrap">
            <label htmlFor="foto" className="customFoto">
              📸
            </label>
            <label>Click to take Photo</label>
          </div>
          <input
            id="foto"
            type="file"
            name="image"
            capture="enviroment"
            accept="image/*"
            onChange={handleChange}
          />
          {fileUploaded ? (
            <>
              <button className="logButton" type="submit">
                SEND
              </button>
            </>
          ) : (
            ''
          )}
        </form>
      </div>
      <div className="secondHalf">
        {fileUploaded ? (
          <div className="imagePreview">
            <img className="imagePreviewActually" src={something}></img>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default PartyRoomPH;
