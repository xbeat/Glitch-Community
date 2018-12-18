/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import {captureException} from '../utils/sentry';

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

export class AnalyticsTrackExternalLink extends React.Component {
  constructor(props) {
    
  render() {
    const {children, properties, to, name, ...props} = this.props;
    return <a href={to} {...props}>{children}</a>;
  }
}
AnalyticsTrackExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.objectOf(PropTypes.string),
  to: PropTypes.string.isRequired,
};

export const AnalyticsTrackClick = ({children, name, properties}) => (
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
AnalyticsTrackClick.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.objectOf(PropTypes.string),
};