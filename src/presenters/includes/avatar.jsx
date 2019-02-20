import React from "react";
import PropTypes from "prop-types";

import {
  DEFAULT_TEAM_AVATAR,
<<<<<<< HEAD
  getAvatarUrl as getTeamAvatarUrl
} from "../../models/team";
import {
  ANON_AVATAR_URL,
  getAvatarThumbnailUrl,
  getDisplayName
} from "../../models/user";

// UserAvatar

export const Avatar = ({ name, src, color, srcFallback, type, hideTooltip }) => {
  const contents = (
=======
  getAvatarUrl as getTeamAvatarUrl,
} from '../../models/team';
import {
  ANON_AVATAR_URL,
  getAvatarThumbnailUrl,
  getDisplayName,
} from '../../models/user';

// UserAvatar

export const Avatar = ({
  name, src, color, srcFallback, type,
}) => (
  <div data-tooltip={name} data-tooltip-left="true">
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    <img
      width="32px"
      height="32px"
      src={src}
      alt={name}
      style={color ? { backgroundColor: color } : null}
<<<<<<< HEAD
      onError={srcFallback ? event => (event.target.src = srcFallback) : null}
      className={type + "-avatar"}
=======
      onError={
        srcFallback
          ? (event) => {
            event.target.src = srcFallback;
          }
          : null
      }
      className={`${type}-avatar`}
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    />
  );

  if (!hideTooltip) {
    <div data-tooltip={name} data-tooltip-left="true">
      {contents}
    </div>;
  }
  return contents;
};
Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcFallback: PropTypes.string,
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
<<<<<<< HEAD
  type: PropTypes.string,
  hideTooltip: PropTypes.bool
};

export const TeamAvatar = ({ team }) => (
  <Avatar
    name={team.name}
    src={getTeamAvatarUrl({ ...team, size: "small" })}
=======
};

Avatar.defaultProps = {
  color: null,
  srcFallback: '',
};

export const TeamAvatar = ({ team }) => (
  <Avatar
    name={team.name}
    src={getTeamAvatarUrl({ ...team, size: 'small' })}
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    srcFallback={DEFAULT_TEAM_AVATAR}
    type="team"
  />
);
TeamAvatar.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired
  }).isRequired
};

<<<<<<< HEAD
export const UserAvatar = ({ user, suffix = "", hideTooltip }) => (
=======
export const UserAvatar = ({ user, suffix = '' }) => (
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
  <Avatar
    name={getDisplayName(user) + suffix}
    src={getAvatarThumbnailUrl(user)}
    color={user.color}
    srcFallback={ANON_AVATAR_URL}
    type="user"
<<<<<<< HEAD
    hideTooltip={hideTooltip}
=======
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
  />
);
UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    name: PropTypes.string,
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string.isRequired
  }).isRequired,
  suffix: PropTypes.string,
<<<<<<< HEAD
  hideTooltip: PropTypes.bool
=======
};

UserAvatar.defaultProps = {
  suffix: '',
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
};
