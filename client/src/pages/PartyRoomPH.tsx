import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  generateRandomString,
  sendImage,
  sendUrlToDb,
  checkRoom,
} from '../ApiServices';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/Dashboard.css';
import { compress, downloadFile } from 'image-conversion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ProgressBar } from 'react-loader-spinner';
import PhotosGrid from '../components/PhotosGrid';

// TODO: ADD PASSWORD TO PRIVATE ROOMS

// reachable at /party/:id/ph/add
function PartyRoomPH() {
  const navigate = useNavigate();
  const fileReader = new FileReader();
  const { id } = useParams();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [something, setSomething] = useState('');
  const [photoTaken, setPhotoTaken] = useState(new Blob());
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth0();
  const [roomExists, setRoomExists] = useState(true);

  useEffect(() => {
    async function fetchRoom() {
      if (id) {
        const exist = await checkRoom(id);
        setRoomExists(exist.exists);
      }
    }
    fetchRoom();
  }, []);

  async function sendIt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // to prevent from doing this action twice if pressing the send button while sending
    if (!loading) {
      setLoading(true);
      // const input = document.getElementById('foto').files[0];
      const input = document.getElementById('foto') as HTMLInputElement | null;
      const file = input?.files![0];
      const url = await sendImage(photoTaken);
      console.log({ url });
      if (url && input) {
        input.value = '';
        await sendUrlToDb(url, id!);
        setSomething('');
        setFileUploaded(false);
        setLoading(false);
      } else {
        alert('something went wrong :C');
      }
    }
  }

  async function downloadIt() {
    downloadFile(photoTaken, generateRandomString(8));
  }

  async function handleChange() {
    let compressed;
    const input = document.getElementById('foto') as HTMLInputElement;
    let photo = input?.files![0];
    if (photo) {
      if (!compressed) {
        compressed = await compress(photo, 0.4);
      }
      setFileUploaded(true);
      fileReader.readAsDataURL(compressed);
      fileReader.addEventListener('load', function () {
        setSomething(this.result as string);
      });
      setPhotoTaken(compressed);
    } else setFileUploaded(false);
  }

  function goBack() {
    navigate(`/party/${id}`);
  }
  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
      {!roomExists ? (
        <h1>Wrong Room :C</h1>
      ) : (
        <>
          <div className="firstHalf">
            {' '}
            ROOM #{id}
            {isAuthenticated ? (
              <button onClick={goBack} className="mainButton">
                Back 2 the Lobby
              </button>
            ) : (
              ''
            )}
            <form id="formSend" onSubmit={sendIt}>
              <div className="fotoWrap">
                <label htmlFor="foto" className="mainButton">
                  {fileUploaded ? 'Take another One 📸' : 'TAKE PHOTO 📸'}
                </label>
              </div>
              <input
                id="foto"
                type="file"
                name="image"
                capture="environment"
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
                height="90"
                width="90"
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
                    DOWNLOAD ⬇️
                  </button>
                </>
              ) : (
                <PhotosGrid id={id ?? ''} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PartyRoomPH;
