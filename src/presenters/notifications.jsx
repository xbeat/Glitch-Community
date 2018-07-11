import React from 'react';

const {Provider, Consumer} = React.createContext();

const Notification = ({children, className}) => (
  <div className={`notification ${className}`}>
    {children}
  </div>
);

export class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }
  
  render() {
    const funcs = {
    };
    return (
      <React.Fragment>
        <Provider value={funcs}>
          {this.props.children}
        </Provider>
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
      </React.Fragment>
    );
  }
}

export default Consumer;