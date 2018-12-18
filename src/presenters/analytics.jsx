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
  name: PropTypes.string.isRequired,
  properties: PropTypes.objectOf(PropTypes.string).isRequired,
};

export const AnalyticsOnClick = ({children, name, properties}) => (
  <AnalyticsTracker>
    {track => React.Children.map(child => {
      function onClick(eve
  </AnalyticsTracker>
);