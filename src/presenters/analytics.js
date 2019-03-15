/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import { isFunction, omit } from 'lodash';
import { captureException } from '../utils/sentry';

const Context = React.createContext({ properties: {}, context: {} });

const resolveProperties = (properties, inheritedProperties) => {
  if (isFunction(properties)) {
    return properties(inheritedProperties);
  }
  return { ...inheritedProperties, ...properties };
};

// stick this in the tree to add a property value to any tracking calls within it
export const AnalyticsContext = ({ children, properties, context }) => {
  const inherited = React.useContext(Context);
  return (
    <Context.Provider
      value={{
        properties: resolveProperties(properties, inherited.properties),
        context: resolveProperties(context, inherited.context),
      }}
    >
      {children}
    </Context.Provider>
  );
};
AnalyticsContext.propTypes = {
  children: PropTypes.node.isRequired,
  properties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  context: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
AnalyticsContext.defaultProps = {
  properties: {},
  context: {},
};

// this gives you a generic track function that pulls in inherited properties
const useAnalyticsTracker = () => {
  const inherited = React.useContext(Context);
  return (name, properties, context) => {
    try {
      analytics.track(name, resolveProperties(properties, inherited.properties), resolveProperties(context, inherited.context));
    } catch (error) {
      /*
      From Segment: "We currently return a 200 response for all API requests so debugging should be done in the Segment Debugger.
      The only exception is if the request is too large / json is invalid it will respond with a 400."
      If it was not a 400, it wasn't our fault so don't track it.
      */
      if (error && error.response && error.response.status === 400) {
        captureException(error);
      }
    }
  };
};

// this is the equivalent of doing <AnalyticsTracker>{track => <asdf onClick={() => track('asdf')}/></AnalyticsTracker>
// this won't work for links that do a full page load, because the request will get cancelled by the nav
// use the TrackedExternalLink for that, because it will stall the page for a moment and let the request finish
export const TrackClick = ({ children, name, properties, context }) => {
  const track = useAnalyticsTracker();
  return React.Children.map(children, (child) => {
    function onClick(...args) {
      track(name, properties, context);
      if (child.props.onClick) {
        return child.props.onClick(...args);
      }
      return null;
    }
    return React.cloneElement(child, { onClick });
  });
};
TrackClick.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  context: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
TrackClick.defaultProps = {
  properties: {},
  context: {},
};

// this uses segment's trackLink, which stalls the page load until the analytics request is done
// it forces a full page load at the end, so don't use it for links within the community site
export const TrackedExternalLink = ({ children, name, properties, to, ...props }) => {
  const inherited = React.useContext(Context);

  const nameRef = React.useRef(name);
  const propertiesRef = React.useRef({});
  React.useEffect(() => {
    nameRef.current = name;
    propertiesRef.current = resolveProperties(properties, inherited.properties);
  });

  const ref = React.useRef(null);
  React.useEffect(() => {
    try {
      // we only call this on first render, use refs to keep the name/properties up to date
      analytics.trackLink(ref.current, () => nameRef.current, () => propertiesRef.current);
    } catch (error) {
      captureException(error);
    }
  }, []);
  return (
    <a href={to} {...omit(props, ['name', 'properties', 'to'])} ref={ref}>
      {children}
    </a>
  );
};
TrackedExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  to: PropTypes.string.isRequired,
};
TrackedExternalLink.defaultProps = {
  properties: {},
};
