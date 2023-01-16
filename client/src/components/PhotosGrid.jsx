import React from 'react';
import { useEffect } from 'react';
import { Grid } from 'react-loader-spinner';
import '../styles/Dashboard.css';
import { getSocketRoomId } from '../ApiServices';
import { io } from 'socket.io-client';
import { useState } from 'react';

/*
  Here you:
  1. get the array of photos from the database (socket.io) 
  2. map it, displaying a photo component for every one of them 
  */

function PhotosGrid({ id }) {
  const [buffer, setBuffer] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 7000);

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
      setBuffer(data);
    });
  }, []);

  function handleLoaded() {
    setTimeout(() => {
      setLoading(false);
    }, 700);
  }

  useEffect(() => {
    setPhotos(buffer);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2200);
  }, [buffer]);

  function openModal(picUrl) {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div>
      <div className={modalOpen ? 'modal' : 'modal invisible'}>
        <span onClick={closeModal}>X</span>
      </div>
      <div className={loading ? 'loaderWrap' : 'invisible'}>
        <Grid
          height="80"
          width="80"
          color="#8139d1"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
      <div className="container">
        <div className="gridContainer">
          {photos.map((pic, idx) => {
            return (
              <img
                className={loading ? 'gridItem' : modalOpen ? 'gridItem slide-fwd visible ' : 'gridItem visible'}
                key={idx}
                src={pic}
                onLoad={handleLoaded}
                onClick={() => openModal(pic)}
              ></img>
            );
          })}
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default PhotosGrid;
