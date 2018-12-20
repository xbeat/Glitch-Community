/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import {isFunction} from 'lodash';
import {captureException} from '../utils/sentry';

const {Provider, Consumer} = React.createContext({});

const resolveProperties = (properties, inheritedProperties) => {
  if (isFunction(properties)) {
    return properties(inheritedProperties);
  }
  return {...inheritedProperties, ...properties};
};

export const AnalyticsContext = ({children, properties}) => (
  <Consumer>
    {inheritedProperties => (
      <Provider value={resolveProperties(properties, inheritedProperties)}>
        {children}
      </Provider>
    )}
  </Consumer>
);
AnalyticsContext.propTypes = {
  children: PropTypes.node.isRequired,
  properties: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.string),
    PropTypes.func,
  ]).isRequired,
};

export const AnalyticsTracker = ({children}) => (
  <Consumer>
    {inheritedProperties => children((name, properties={}) => {
      try {
        analytics.track(name, resolveProperties(properties, inheritedProperties));
      } catch (error) {
        captureException(error);
      }
    })}
  </Consumer>
);
AnalyticsTracker.propTypes = {
  children: PropTypes.func.isRequired,
};

class TrackedExternalLinkWithoutContext extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidMount() {
    try {
      analytics.trackLink(this.ref.current, () => this.props.name, () => this.props.properties);
    } catch (error) {
      captureException(error);
    }
  }
  render() {
    const {children, name, properties, to, ...props} = this.props;
    return <a href={to} {...props} ref={this.ref}>{children}</a>;
  }
}
export const TrackedExternalLink = ({children, name, properties, to, ...props}) => (
  <Consumer>
    {inheritedProperties => (
      <TrackedExternalLinkWithoutContext to={to} name={name} properties={resolveProperties(properties, inheritedProperties)} {...props}>
        {children}
      </TrackedExternalLinkWithoutContext>
    )}
  </Consumer>
);
TrackedExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.string),
    PropTypes.func,
  ]),
  to: PropTypes.string.isRequired,
};

// fyi this won't work for links that do a full page load, because the request will get cancelled by the nav
// use the TrackedExternalLink for that, because it will stall the page for a moment and let the request finish
export const TrackClick = ({children, name, properties}) => (
  <AnalyticsTracker>
    {track => React.Children.map(children, child => {
      function onClick(...args) {
        track(name, properties);
        if (child.props.onClick) {
          return child.props.onClick(...args);
        }
      }
      return React.cloneElement(child, {onClick});
    })}
  </AnalyticsTracker>
);
TrackClick.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.string),
    PropTypes.func,
  ]),
};