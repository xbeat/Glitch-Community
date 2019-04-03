import React from 'react';
import PropTypes from 'prop-types';
import { getProfileStyle as getTeamProfileStyle } from '../../models/team';
import { getProfileStyle as getUserProfileStyle } from '../../models/user';
import styles from './search-result-cover-bar.styl';

const getProfileStyles = {
  team: getTeamProfileStyle,
  user: getUserProfileStyle,
};

const SearchResultCoverBar = ({ type, item, size }) => <div className={styles.cover} style={getProfileStyles[type]({ ...item, size })} />;

SearchResultCoverBar.propTypes = {
  type: PropTypes.oneOf(['user', 'team']).isRequired,
  size: PropTypes.oneOf(['medium', 'large']).isRequired,
};

export default SearchResultCoverBar;
