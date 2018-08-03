import React from 'react';
import PropTypes from 'prop-types';

import LocalStorage from '

const {Provider, Consumer} = React.createContext();

export const UserPrefsProvider = ({children}) => (
  <