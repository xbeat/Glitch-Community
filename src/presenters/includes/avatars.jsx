import React from 'react';
import PropTypes from 'prop-types';

import {UserLink} from './includes/link.jsx';
import {ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName} from '../models/user.js';

function getStyle({color}) {
  return {backgroundColor: color};
}

const GLITCH_TEAM_AVATAR = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";

// UserAvatar

const Avatar = ({name, src, style, srcFallback}) => (
  <span className="user-list-avatar" data-tooltip={name} data-tooltip-left="true">
    <img width="32px" height="32px"
      src={src} style={style} alt={name} onError={event => event.target.src = srcFallback}
    />
  </span>
);
Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcFallback: PropTypes.string.isRequired,
  style: PropTypes.object,
};

const UserAvatar = ({user, suffix=''}) => (
  <Avatar name={getDisplayName(user) + suffix} src={getAvatarThumbnailUrl(user)} style={getStyle(user)} srcFallback={ANON_AVATAR_URL}/>
);
UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    name: PropTypes.string,
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
  }).isRequired,
  suffix: PropTypes.string,
};