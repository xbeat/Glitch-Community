/* globals CDN_URL */
import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import { getProfileStyle as getTeamProfileStyle } from '../../models/team';
import { getProfileStyle as getUserProfileStyle } from '../../models/user';
import styles from './search-result-cover-bar.styl';

const getProfileStyles = {
  team: getTeamProfileStyle,
  user: getUserProfileStyle,
};

const cacheBuster = Math.floor(Math.random() * 1000);

const TeamCoverBar = ({ size, id, cache = cacheBuster }) => (
  <div className={styles.cover}>
    <Image
      src={`${CDN_URL}/team-cover/${id}/${size}?${cache}`}
      defaultSrc="https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625"
      alt=""
    />
  </div>
);

const UserCoverBar = ({ size, id, cache = cacheBuster }) => (
  <div className={styles.cover}>
    <Image
      src={`${CDN_URL}/team-cover/${id}/${size}?${cache}`}
      defaultSrc="https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625"
      alt=""
    />
  </div>
);

const SearchResultCoverBar = ({ type, item, size }) => {
  if (type === 'team') {
    return <TeamCoverBar size={size} id={item.id} />;
  }

  return <div className={styles.cover} style={getProfileStyles[type]({ ...item, size })} />;
};

SearchResultCoverBar.propTypes = {
  type: PropTypes.oneOf(['user', 'team']).isRequired,
  size: PropTypes.oneOf(['medium', 'large']).isRequired,
};

export default SearchResultCoverBar;
