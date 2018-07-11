import React from 'react';
import PropTypes from 'prop-types';

import {uploadAsset, uploadAssetSizes} from '../../utils/assets';
import Notifications from '../notifications.jsx';

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
    this.setState({
      uploading: true,
      progress: 0,
    });
    try {
      url = await uploadAsset(blob, policy, key,
        ({lengthComputable, loaded, total}) => {
          if (lengthComputable) {
            this.setState({progress: loaded/total});
          } else {
            this.setState(({progress}) => ({progress: (progress+1)/2}));
          }
        }
      );
    } catch (e) {
      this.props.createNotification('File upload failed. Try again in a few minutes?', 'notifyUploadFailure');
      throw e;
    } finally {
      this.setState({uploading: false});
    }
    return url;
  }
  
  async uploadAssetSizes(blob, policy, sizes) {
    this.setState({
      uploading: true,
      progress: 0,
    });
    try {
      await uploadAssetSizes(blob, policy, sizes,
        ({lengthComputable, loaded, total}) => {
          if (lengthComputable) {
            this.setState({progress: loaded/total});
          } else {
            this.setState(({progress}) => ({progress: (progress+1)/2}));
          }
        }
      );
    } catch (e) {
      this.props.createNotification('File upload failed. Try again in a few minutes?', 'notifyUploadFailure');
      throw e;
    } finally {
      this.setState({uploading: false});
    }
  }
  
  render() {
    const {children} = this.props;
    const {uploading, progress} = this.state;
    const funcs = {
      uploadAsset: this.uploadAsset.bind(this),
      uploadAssetSizes: this.uploadAssetSizes.bind(this),
    };
    return (
      <React.Fragment>
        <aside className="notifications">
          {uploading && (
            <div className="notification notifyUploading">
              Uploading asset
              <progress className="notify-progress" value={progress}></progress>
            </div>
          )}
        </aside>
        {children(funcs)}
      </React.Fragment>
    );
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