import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useMedia } from '../hooks/useMedia';
import { likePhoto, unlikePhoto } from '../actions/userActions';
import { saveAs } from 'file-saver';
import { HEART_SVG } from '../assets/logo';
import './PhotoView.css';

function PhotoView({ match }) {
  const { media } = useMedia({
    url: `${process.env.REACT_APP_BASE_IMAGE_URL}${match.params.id}`,
  });
  const user = useSelector((state) => state.user);
  const activeUser = user.users.byId[user.authenticatedUser];
  const dispatch = useDispatch();
  const history = useHistory();

  function likeEvent() {
    if (!user.isAuthenticated) {
      history.replace({
        pathname: '/login',
      });
    }

    if (activeUser.photos?.indexOf(media.id) !== -1) {
      dispatch(unlikePhoto(activeUser, media.id));
      return;
    }
    dispatch(likePhoto(activeUser, media.id));
  }

  return (
    <>
      <div className='header'>
        <div className='photographer'>{media && media.photographer}</div>

        <div className='interactions'>
          <button onClick={likeEvent}>
            {HEART_SVG}
            Like
          </button>

          <button
            onClick={() => {
              saveAs(media.src.original, media.id);
            }}
          >
            Download
          </button>
        </div>
      </div>

      {media && (
        <img
          className='image-view'
          src={media?.src?.landscape}
          alt={media.id}
        />
      )}
    </>
  );
}

export default PhotoView;
