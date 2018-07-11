import React from 'react';
import PropTypes from 'prop-types';

import {uploadAsset, uploadAssetSizes} from '../../utils/assets';
import Notifications from '../notifications.jsx';

const NotifyUploading = ({progress}) => (
  <React.Fragment>
    Uploading asset
    <progress className="notify-progress" value={progress}></progress>
  </React.Fragment>
);
const NotifyError = () => 'File upload failed. Try again in a few minutes?';

async function uploadWrapper(createNotification, createPersistentNotification, upload, ...args) {
  let result = null;
  let progress = 0;
  const {
    updateNotification,
    removeNotification,
  } = createPersistentNotification(<NotifyUploading progress={progress}/>, 'notifyUploading');
  try {
    result = await upload(...args,
      ({lengthComputable, loaded, total}) => {
        if (lengthComputable) {
          progress = loaded/total;
        } else {
          progress = (progress+1)/2;
        }
        updateNotification(<NotifyUploading progress={progress}/>);
      }
    );
  } catch (e) {
    createNotification(<NotifyError/>, 'notifyError');
    throw e;
  } finally {
    removeNotification();
  }
  return result;
}

const Uploader = ({createNotification, createPersistentNotification, children}) => (
);
Uploader.propTypes = {
  children: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  createPersistentNotification: PropTypes.func.isRequired,
};

const UploaderContainer = ({children}) => (
  <Notifications>
    {notifications => (
  children({
    uploadAsset: (blob, policy, key) => {
      return uploadWrapper(createNotification, createPersistentNotification, uploadAsset, blob, policy, key);
    },
    uploadAssetSizes: (blob, policy, sizes) => {
      return uploadWrapper(createNotification, createPersistentNotification, uploadAssetSizes, blob, policy, sizes);
    },
  })
    )}
  </Notifications>
);
UploaderContainer.propTypes = {
  children: PropTypes.func.isRequired,
};
export default UploaderContainer;