import React from 'react';
import { useState } from 'react';
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
import { useQuery } from 'react-query';

// TODO: ADD PASSWORD TO PRIVATE ROOMS

function PartyRoomPH() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [imgPreview, setImgPreview] = useState('');
  const [photoTaken, setPhotoTaken] = useState(new Blob());
  const fileReader = new FileReader();

  const { isLoading, isError } = useQuery('check if room exists', async () => {
    const exist = await checkRoom(id ?? '');
    if (exist.exists) {
      return;
    } else {
      throw new Error('The room does not exist');
    }
  });

  async function sendIt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = document.getElementById('foto') as HTMLInputElement | null;
    const file = input?.files![0];
    const url = await sendImage(photoTaken);
    if (url && file) {
      input.value = '';
      await sendUrlToDb(url, id!);
      if (isAuthenticated) {
        navigate(`/party/${id}`);
      }
      setFileUploaded(false);
    } else {
      alert('something went wrong :C');
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
      compressed = await compress(photo, 0.4);
      fileReader.readAsDataURL(compressed);
      fileReader.addEventListener('load', function () {
        setImgPreview(this.result as string);
      });
      setFileUploaded(true);
      setPhotoTaken(compressed);
    } else {
      setFileUploaded(false);
    }
  }

  function goBack() {
    navigate(`/party/${id}`);
  }
  return (
    <div className="dashboardWrapper">
      <Navbar></Navbar>
      {isError ? (
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
                  <button
                    className="logButton"
                    type="submit"
                    disabled={!fileUploaded}
                  >
                    SEND
                  </button>
                </>
              ) : (
                ''
              )}
            </form>
          </div>
          {isLoading ? (
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
                    <img
                      className="imagePreviewActually"
                      src={imgPreview}
                      alt=""
                    ></img>
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
