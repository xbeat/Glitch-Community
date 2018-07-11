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

class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      progress: 0,
    };
  }
  
  async uploadAsset(blob, policy, key) {
    let url = null;
    let progress = 0;
    const {
      updateNotification,
      removeNotification,
    } = this.props.createPersistentNotification(<NotifyUploading progress={progress}/>, 'notifyUploading');
    try {
      url = await uploadAsset(blob, policy, key,
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
      this.props.createNotification(<NotifyError/>, 'notifyError');
      throw e;
    } finally {
      removeNotification();
    }
    return url;
  }
  
  async uploadAssetSizes(blob, policy, sizes) {
    let progress = 0;
    const {
      updateNotification,
      removeNotification,
    } = this.props.createPersistentNotification(<NotifyUploading progress={progress}/>, 'notifyUploading');
    try {
      await uploadAssetSizes(blob, policy, sizes,
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
      this.props.createNotification(<NotifyError/>, 'notifyError');
      throw e;
    } finally {
      removeNotification();
    }
  }
  
  render() {
    const funcs = {
      uploadAsset: this.uploadAsset.bind(this),
      uploadAssetSizes: this.uploadAssetSizes.bind(this),
    };
    return this.props.children(funcs);
  }
}
Uploader.propTypes = {
  children: PropTypes.func.isRequired,
};

const UploaderContainer = ({children}) => (
  <Notifications>
    {notifications => (
      <Uploader {...notifications}>
        {children}
      </Uploader>
    )}
  </Notifications>
);
export default UploaderContainer;