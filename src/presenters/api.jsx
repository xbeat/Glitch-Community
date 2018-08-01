import React from 'react';
import PropTypes from 'prop-types';

const {Provider, Consumer} = React.createContext();

export const ApiProvider = ({api, children}) => (
  <Provider value={api}>{children}</Provider>
);
ApiProvider.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
};

export const ApiConsumer = ({children}) => (
  <Consumer>{children}</Consumer>
);
ApiConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};