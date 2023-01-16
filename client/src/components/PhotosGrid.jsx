import React from 'react';
import { useEffect } from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';
import '../styles/Dashboard.css';
import { getSocketRoomId } from '../ApiServices';
import { io } from 'socket.io-client';
import { useState } from 'react';

/*
  Here you:
  1. get the array of photos from the database (socket.io) 
  2. map it, displaying a photo component for every one of them 
  */

function PhotosGrid({id}) {
  const [buffer, setBuffer] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);

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

  useEffect(() => {
    setPhotos(buffer);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [buffer]);

  return (
    <div>
      {loading ? (
        <div className="loaderWrap">
          <MagnifyingGlass
            visible={true}
            height="90"
            width="90"
            ariaLabel="MagnifyingGlass-loading"
            wrapperStyle={{}}
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor="#ecbef7"
            color="#8139d1"
          />
        </div>
      ) : (
        <div className="container">
          {!photos.length ? (
            <h3>No pics for now</h3>
          ) : (
            <div className="gridContainer">
              {photos.map((pic, idx) => {
                return <img className="gridItem" key={idx} src={pic}></img>;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PhotosGrid;
