import React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { sendImage } from '../ApiServices';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/Dashboard.css';
import 'react-html5-camera-photo/build/css/index.css';
import { compress, compressAccurately, downloadFile } from 'image-conversion';

// reachable at /party/:id/ph/add
function PartyRoomPH() {
  const fileReader = new FileReader();
  const { id } = useParams();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [something, setSomething] = useState('');
  const [photoTaken, setPhotoTaken] = useState({});

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
    const input = document.getElementById('foto').files[0];
    // input.name = await generateRandomString(9);
    // console.log(input.name);
    // let sizeInMb = Math.trunc(input.size/1024/1024);
    // let compressed;
    // if (sizeInMb >= 3) {
    //   compressed = await compressAccurately(input,3000) // compress to 3MB if it's bigger
    //   console.log('size before:' + sizeInMb + '  Size after: ' + compressed.size)
    // }
    // if(!compressed) {
    //   compressed = await compress(input, 1);
    // }
    console.log(photoTaken);
    console.log(photoTaken.name);
    await sendImage(photoTaken, id);
    alert('Sent :D');
    input.value = null;
    setSomething(false);
    setFileUploaded(false);
  }

  async function downloadIt() {
    downloadFile(photoTaken, generateRandomString(8));
  }

  async function handleChange() {
    let compressed;
    const input = document.getElementById('foto');
    let photo = input.files[0];
    if (photo) {
      setFileUploaded(true);
      fileReader.readAsDataURL(photo);
      fileReader.addEventListener('load', function () {
        setSomething(this.result);
      });
      let sizeInMb = Math.trunc(photo.size / 1024 / 1024);
      if (sizeInMb >= 3) {
        compressed = await compressAccurately(photo, 3000); // compress to 3MB if it's bigger
        console.log(
          'size before:' + sizeInMb + '  Size after: ' + compressed.size
        );
      }
      if (!compressed) {
        compressed = await compress(photo, 1);
      }
      setPhotoTaken(compressed);
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
          <>
            <div className="imagePreview">
              <img className="imagePreviewActually" src={something}></img>
            </div>
            <button className="logButton" onClick={downloadIt()}>
              DOWNLOAD
            </button>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default PartyRoomPH;
