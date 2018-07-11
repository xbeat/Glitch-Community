import React from 'react';

const {Provider, Consumer} = React.createContext({
  createNotification: (content) => console.log(content),
});

const Notification = ({children, className, remove}) => (
  <aside className={`notification ${className}`} onAnimationEnd={remove}>
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
  
  create(content, className='') {
    const notification = {
      id: `${Date.now()}{Math.random()}`,
      content, className,
    };
    this.setState(({notifications}) => ({
      notifications: [...notifications, notification],
    }));
  }
  
  remove(id) {
    this.setState(({notifications}) => ({
      notifications: notifications.filter(n => n.id !== id),
    }));
  }
  
  render() {
    const funcs = {
      createNotification: this.create.bind(this),
    };
    const {notifications} = this.state;
    window.notify = funcs; //weewoo weeoo test code here
    return (
      <React.Fragment>
        <Provider value={funcs}>
          {this.props.children}
        </Provider>
        {!!notifications.length && (
          <div className="notifications">
            {notifications.map(({id, className, content}) => (
              <Notification key={id} className={className} remove={this.remove.bind(this, id)}>
                {content}
              </Notification>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Consumer;