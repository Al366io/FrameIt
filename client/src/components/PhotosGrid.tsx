import { useEffect } from 'react';
import { Grid } from 'react-loader-spinner';
import { getSocketRoomId, fetchPicsFromParty } from '../ApiServices';
import { io } from 'socket.io-client';
import { useState } from 'react';
import { downloadImage } from '../utils/utils';

import '../styles/animations.css';
import '../styles/Dashboard.css';
import { useQuery } from 'react-query';

type PhotosGridProps = {
  id: string;
};
const socket = io('https://frameit.social');

function PhotosGrid({ id }: PhotosGridProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // get pics on load
  const { isLoading, isError, data } = useQuery(['get pics', id], async () =>
    fetchPicsFromParty(id)
  );

  useEffect(() => {
    if (data) {
      setPhotos([...data]);
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      const socketRoomId = await getSocketRoomId(id);
      socket.emit('joinRoom', socketRoomId);
      // wait for new images
      socket.on('pic', (newPic) => {
        if (newPic) {
          setPhotos((photos) => [...photos, newPic]);
        }
      });
    })();
    // clean-up function
    return () => {
      socket.off('pic');
    };
  }, [id, setPhotos]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error</span>;
  }

  function openModal(picUrl: string) {
    setModalOpen(true);
    setModalUrl(picUrl);
  }

  function closeModal() {
    setModalOpen(false);
    setModalUrl('');
  }

  return (
    <div>
      <div
        className={modalOpen ? 'modal' : 'modal invisible'}
        onClick={closeModal}
      >
        <img src={modalUrl} className="innerModal" alt=""></img>
        <button
          className="logButton zidx"
          onClick={() => downloadImage(modalUrl)}
        >
          DOWNLOAD ⬇️
        </button>
      </div>
      <div className={isLoading ? 'loaderWrap' : 'invisible'}>
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
          {photos?.map((pic, idx) => {
            return (
              <img
                className={isLoading ? 'gridItem' : 'gridItem visible'}
                key={idx}
                src={pic}
                onClick={() => openModal(pic)}
                alt=""
              ></img>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PhotosGrid;
