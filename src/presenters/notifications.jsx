import React from "react";
import PropTypes from "prop-types";

const { Provider, Consumer } = React.createContext();

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

  create(content, className = "") {
    const notification = {
      id: `${Date.now()}{Math.random()}`,
      className,
      content
    };
    this.setState(({ notifications }) => ({
      notifications: [...notifications, notification]
    }));
    return notification.id;
  }

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
      notifications: notifications.filter(n => n.id !== id)
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

export const AddProjectToCollectionMsg = ({
  projectName,
  collectionName,
  url
}) => (
  <>
    <p>
      Added <b>{projectName}</b> { collectionName ? ("to collection" + <b>collectionName</b>) : null }
    </p>
    { url ?
      <a
        href={url}
        rel="noopener noreferrer"
        className="button button-small button-tertiary button-in-notification-container notify-collection-link"
      >
      Take me there
      </a>
      : null}
  </>
);

AddProjectToCollectionMsg.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string,
  url: PropTypes.string
};

export const authenticationMsg =
  "You are not authorized to edit this collection.";

export default Consumer;
