import React from 'react';
import PropTypes from 'prop-types';

import {uploadAsset, uploadAssetSizes} from '../../utils/assets';
import Notifications from '../notifications.jsx';

const NotifyUploading = ({progress}) => (
  <>
    Uploading asset
    <progress className="notify-progress" value={progress}></progress>
  </>
);
const NotifyError = () => 'File upload failed. Try again in a few minutes?';

async function uploadWrapper(notifications, upload) {
  let result = null;
  let progress = 0;
  const {
    updateNotification,
    removeNotification,
  } = notifications.createPersistentNotification(<NotifyUploading progress={progress}/>, 'notifyUploading');
  try {
    result = await upload(
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
    notifications.createErrorNotification(<NotifyError/>);
    throw e;
  } finally {
    removeNotification();
    notifications.createNotification('Image uploaded!');
  }
  return result;
}

const Uploader = ({children}) => (
  <Notifications>
    {notifications => (
      children({
        uploadAsset: (blob, policy, key) => {
          return uploadWrapper(notifications, cb => uploadAsset(blob, policy, key, cb));
        },
        uploadAssetSizes: (blob, policy, sizes) => {
          return uploadWrapper(notifications, cb => uploadAssetSizes(blob, policy, sizes, cb));
        },
      })
    )}
  </Notifications>
);
Uploader.propTypes = {
  children: PropTypes.func.isRequired,
};
export default Uploader;