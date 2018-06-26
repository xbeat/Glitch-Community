import React from 'react';
import PropTypes from 'prop-types';

import {uploadAssetSizes} from '../../utils/assets';

export default class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      progress: 0,
      error: false,
    };
  }
  
  async uploadAssetSizes(blob, policy, sizes) {
    this.setState({
      uploading: true,
      progress: 0,
      error: false,
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
    } finally {
      this.setState({uploading: false});
    }
  }
  
  render() {
    const {children} = this.props;
    const {uploading, progress, error} = this.state;
    return (
      <React.Fragment>
        <aside className="notifications">
          {uploading && (
            <div className="notification notifyUploading">
              Uploading asset
              <progress className="notify-progress" value={progress}></progress>
            </div>
          )}
          {error && (
            <div className="notification notifyUploadFailure">File upload failed. Try again in a few minutes?</div>
          )}
        </aside>
        {children({uploadAssetSizes: this.uploadAssetSizes.bind(this)})}
      </React.Fragment>
    );
  }
}

Uploader.propTypes = {
  children: PropTypes.func.isRequired,
};