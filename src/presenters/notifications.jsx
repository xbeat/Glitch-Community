import React from 'react';

const {Provider, Consumer} = React.createContext({
  createNotification: (content) => console.log(content),
});

const Notification = ({children, className}) => (
  <aside className={`notification ${className}`}>
    {children}
  </aside>
);

export class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }
  
  createNotification(content, className='') {
    const notification = {
      id: `${Date.now()}{Math.random()}`,
      content, className,
    };
    this.setState(({notifications}) => ({
      notifications: [...notifications, notification],
    }));
  }
  
  removeNotification(id) {
    this.setState(({notifications}) => ({
      notifications: notifications.filter(n => n.id !== id),
    }));
  }
  
  render() {
    const funcs = {
      createNotification: this.createNotification.bind(this),
    };
    window.notify = funcs; //weewoo weeoo test code here
    return (
      <React.Fragment>
        <Provider value={funcs}>
          {this.props.children}
        </Provider>
        <div className="notifications">
          {this.state.notifications.map(({id, className, content}) => (
            <Notification key={id} className={className} onAnimationEnd={() => this.removeNotification(id)}>
              {content}
            </Notification>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Consumer;