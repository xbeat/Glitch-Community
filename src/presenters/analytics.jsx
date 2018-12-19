/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import {captureException} from '../utils/sentry';
import {Link} from './includes/link';

const {Provider, Consumer} = React.createContext({});

export const AnalyticsContext = ({children, properties}) => (
  <Consumer>
    {inheritedProperties => (
      <Provider value={{...inheritedProperties, ...properties}}>
        {children}
      </Provider>
    )}
  </Consumer>
);
AnalyticsContext.propTypes = {
  children: PropTypes.node.isRequired,
  properties: PropTypes.objectOf(PropTypes.string).isRequired,
};

export const AnalyticsTracker = ({children}) => (
  <Consumer>
    {inheritedProperties => children((name, properties={}) => {
      try {
        analytics.track(name, {...inheritedProperties, ...properties});
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
      if (this.ref.current instanceof HTMLAnchorElement) {
        analytics.trackLink(this.ref.current, () => this.props.name, () => this.props.properties);
      } else {
        throw new Error('
    } catch (error) {
      captureException(error);
    }
  }
  render() {
    const {children, name, properties, to, ...props} = this.props;
    return <Link to={to} {...props} ref={this.ref}>{children}</Link>;
  }
}
export const TrackedExternalLink = ({children, name, properties, to, ...props}) => (
  <Consumer>
    {inheritedProperties => (
      <TrackedExternalLinkWithoutContext to={to} name={name} properties={{...inheritedProperties, ...properties}} {...props}>
        {children}
      </TrackedExternalLinkWithoutContext>
    )}
  </Consumer>
);
TrackedExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.objectOf(PropTypes.string),
  to: PropTypes.string.isRequired,
};

export const TrackClick = ({children, name, properties}) => (
  <AnalyticsTracker>
    {track => React.Children.map(children, child => {
      function onClick(event) {
        track(name, properties);
        if (child.onClick) {
          return child.onClick(event);
        }
      }
      return React.cloneElement(child, {onClick});
    })}
  </AnalyticsTracker>
);
TrackClick.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.objectOf(PropTypes.string),
};