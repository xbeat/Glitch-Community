import React from 'react';
import PropTypes from 'prop-types';

import TooltipContainer from '../../components/tooltips/tooltip-container';

import { DEFAULT_TEAM_AVATAR, getAvatarUrl as getTeamAvatarUrl } from '../../models/team';
import { ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName } from '../../models/user';

// UserAvatar

export const Avatar = ({ name, src, color, srcFallback, type, hideTooltip, withinButton }) => {
  let onError = null;
  if (srcFallback) {
    onError = (event) => {
      event.target.src = srcFallback;
    };
  }

  const contents = (
    <img
      width="32px"
      height="32px"
      src={src}
      alt={name}
      style={color ? { backgroundColor: color } : null}
      onError={onError}
      className={`${type}-avatar`}
    />
  );

  if (!hideTooltip) {
    return <TooltipContainer tooltip={name} target={contents} type="action" id={`avatar-tooltip-${name}`} align={['left']} fallback={withinButton} />;
  }
  return contents;
};

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcFallback: PropTypes.string,
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
};

Avatar.defaultProps = {
  color: null,
  srcFallback: '',
  hideTooltip: false,
};

export const TeamAvatar = ({ team, hideTooltip }) => (
  <Avatar
    name={team.name}
    src={getTeamAvatarUrl({ ...team, size: 'small' })}
    srcFallback={DEFAULT_TEAM_AVATAR}
    type="team"
    hideTooltip={hideTooltip}
  />
);
TeamAvatar.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
  }).isRequired,
  hideTooltip: PropTypes.bool,
};
TeamAvatar.defaultProps = {
  hideTooltip: false,
};

export const UserAvatar = ({ user, suffix = '', hideTooltip, withinButton }) => (
  <Avatar
    name={getDisplayName(user) + suffix}
    src={getAvatarThumbnailUrl(user)}
    color={user.color}
    srcFallback={ANON_AVATAR_URL}
    type="user"
    hideTooltip={hideTooltip}
    withinButton={withinButton}
  />
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
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
};

UserAvatar.defaultProps = {
  suffix: '',
  hideTooltip: false,
  withinButton: false,
};
