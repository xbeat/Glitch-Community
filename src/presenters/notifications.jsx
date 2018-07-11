import React from 'react';

const {Provider, Consumer} = React.createContext({
  createNotification: (content) => console.log(content),
});

const Notification = ({content, className}) => (
  <aside className={`notification ${className}`}>
    {content}
  </aside>
);

export class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }
  
  createNotification(content) {
    const notification = {
      content,
    };
    this.setState(({notifications}) => ({
      notifications: [...notifications, notification],
    }));
  }
  
  render() {
    const funcs = {
      createNotification: this.createNotification.bind(this),
    };
    return (
      <React.Fragment>
        <Provider value={funcs}>
          {this.props.children}
        </Provider>
        <div className="notifications">
          {this.state.notifications.map(({id, className, children}) => (
            <Notification key={id} className={className}>
              {children}
            </Notification>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Consumer;