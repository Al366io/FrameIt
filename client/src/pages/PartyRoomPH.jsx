import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateRandomString, sendImage, sendUrlToDb } from '../ApiServices';
// import { useAuth0 } from '@auth0/auth0-react';
import '../styles/Dashboard.css';
import { compress, downloadFile } from 'image-conversion';
import Navbar from '../components/Navbar';
import { ProgressBar } from 'react-loader-spinner';

// reachable at /party/:id/ph/add
function PartyRoomPH() {
  const fileReader = new FileReader();
  const { id } = useParams();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [something, setSomething] = useState('');
  const [photoTaken, setPhotoTaken] = useState({});
  const [loading, setLoading] = useState(false);

  async function sendIt(e) {
    e.preventDefault();
    setLoading(true);
    const input = document.getElementById('foto').files[0];
    const url = await sendImage(photoTaken, id);
    if (url) {
      // alert('Sent :D');
      input.value = null;
      setSomething(false);
      setFileUploaded(false);
      await sendUrlToDb(url, id);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      alert('something went wrong :C');
    }
  }

  async function downloadIt() {
    downloadFile(photoTaken, generateRandomString(8));
  }

  async function handleChange() {
    let compressed;
    const input = document.getElementById('foto');
    let photo = input.files[0];
    if (photo) {
      if (!compressed) {
        compressed = await compress(photo, 0.3);
      }
      setFileUploaded(true);
      fileReader.readAsDataURL(compressed);
      fileReader.addEventListener('load', function () {
        setSomething(this.result);
      });
      setPhotoTaken(compressed);
    } else setFileUploaded(false);
  }

  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
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
      {loading ? (
        <div className="secondHalf">
          <ProgressBar
            height="80"
            width="80"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            borderColor="#8139d1"
            barColor="#e5b9ed"
          />
        </div>
      ) : (
        <div className="secondHalf">
          {fileUploaded ? (
            <>
              <div className="imagePreview">
                <img className="imagePreviewActually" src={something}></img>
              </div>
              <button className="logButton" onClick={downloadIt}>
                DOWNLOAD
              </button>
            </>
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
}

export default PartyRoomPH;
