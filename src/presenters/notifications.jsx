import React from "react";
import PropTypes from "prop-types";

<<<<<<< HEAD
const { Provider, Consumer } = React.createContext();
=======
const context = React.createContext();
const { Provider } = context;
export const NotificationConsumer = context.Consumer;
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656

const Notification = ({ children, className, remove }) => (
  <aside className={`notification ${className}`} onAnimationEnd={remove}>
    {children}
  </aside>
);

export class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };
  }

<<<<<<< HEAD
  create(content, className = "") {
=======
  create(content, className = '') {
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    const notification = {
      id: `${Date.now()}{Math.random()}`,
      className,
      content
    };
    this.setState(({ notifications }) => ({
<<<<<<< HEAD
      notifications: [...notifications, notification]
=======
      notifications: [...notifications, notification],
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    }));
    return notification.id;
  }

<<<<<<< HEAD
  createError(content = "Something went wrong. Try refreshing?") {
    this.create(content, "notifyError");
  }

  createPersistent(content, className = "") {
    const id = this.create(content, `notifyPersistent ${className}`);
    const updateNotification = content => {
      this.setState(({ notifications }) => ({
        notifications: notifications.map(
          n => (n.id === id ? { ...n, content } : n)
        )
=======
  createError(content = 'Something went wrong. Try refreshing?') {
    this.create(content, 'notifyError');
  }

  createPersistent(content, className = '') {
    const id = this.create(content, `notifyPersistent ${className}`);
    const updateNotification = (updatedContent) => {
      this.setState(({ notifications }) => ({
        notifications: notifications.map(n => (n.id === id ? { ...n, updatedContent } : n)),
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
      }));
    };
    const removeNotification = () => {
      this.remove(id);
    };
    return {
      updateNotification,
      removeNotification
    };
  }

  remove(id) {
    this.setState(({ notifications }) => ({
<<<<<<< HEAD
      notifications: notifications.filter(n => n.id !== id)
=======
      notifications: notifications.filter(n => n.id !== id),
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    }));
  }

  render() {
    const funcs = {
      createNotification: this.create.bind(this),
      createPersistentNotification: this.createPersistent.bind(this),
      createErrorNotification: this.createError.bind(this)
    };
    const { notifications } = this.state;
    return (
      <>
        <Provider value={funcs}>{this.props.children}</Provider>
        {!!notifications.length && (
          <div className="notifications">
            {notifications.map(({ id, className, content }) => (
              <Notification
                key={id}
                className={className}
                remove={this.remove.bind(this, id)}
              >
                {content}
              </Notification>
            ))}
          </div>
        )}
      </>
    );
  }
}
<<<<<<< HEAD

export const AddProjectToCollectionMsg = ({
  projectDomain,
  collectionName,
  url
}) => (
  <>
    <p>
      Added {projectDomain} { collectionName && (`to collection ${collectionName}`) }
    </p>
    { url &&
      <a
        href={url}
        rel="noopener noreferrer"
        className="button button-small button-tertiary button-in-notification-container notify-collection-link"
      >
      Take me there
      </a>
    }
  </>
);

AddProjectToCollectionMsg.propTypes = {
  projectDomain: PropTypes.string.isRequired,
  collectionName: PropTypes.string,
  url: PropTypes.string
};

export default Consumer;
=======
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
