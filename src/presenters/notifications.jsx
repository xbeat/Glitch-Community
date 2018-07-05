// eventually replaces notifications.js, once all pages are react-ified

import React from 'react';
import PropTypes from 'prop-types';

const NotificationContext = React.createContext();

export class NotificationProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      message: '',
    };
  };

  show(message) {
    this.setState({
      message,
      isVisible: true,
    });
  };

  hide() {
    this.setState({
      message: '',
      isVisible: false,
    });
  };

  render() {
    const { children } = this.props;

    return (
      <NotificationContext.Provider
        value={{
          show: this.show,
          hide: this.hide,
          isVisible: this.state.isVisible,
          message: this.state.message,
        }}
      >
        <Notification />
        {children}
      </NotificationContext.Provider>
    );
  }
}

// export const NotificationConsumer = NotificationContext.Consumer;
export const notification = () => (
  <NotificationContext.Consumer>
  
  </NotificationContext.Consumer>
)