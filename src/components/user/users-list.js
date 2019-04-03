import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Avatar, UserAvatar, TeamAvatar } from 'Components/images/avatar';

import { UserLink, TeamLink } from '../../presenters/includes/link';
import styles from './users-list.styl';

const getContainerClass = (layout) => classnames(styles.container, styles[layout]);

// StaticUsersList

export const StaticUsersList = ({ users, layout }) => (
  <ul className={getContainerClass(layout)}>
    {users.map((user) => (
      <li key={user.id}>
        <span className={styles.user}>
          <UserAvatar user={user} />
        </span>
      </li>
    ))}
  </ul>
);
StaticUsersList.propTypes = {
  users: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['row', 'block']).isRequired,
};

// UserTile

export const UserTile = ({ user }) => (
  <UserLink user={user} className={styles.user}>
    <UserAvatar user={user} />
  </UserLink>
);
UserTile.propTypes = {
  user: PropTypes.object.isRequired,
};

// PopulatedUsersList

const PopulatedUsersList = ({ users, teams, layout }) => {
  if (users.length) {
    return (
      <ul className={getContainerClass(layout)}>
        {users.map((user) => (
          <li key={user.id}>
            <UserLink user={user} className={styles.user}>
              <UserAvatar user={user} />
            </UserLink>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={getContainerClass(layout)}>
      {teams.map((team) => (
        <li key={team.id}>
          <TeamLink team={team} className={styles.team}>
            <TeamAvatar team={team} />
          </TeamLink>
        </li>
      ))}
    </ul>
  );
};
PopulatedUsersList.propTypes = {
  users: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['row', 'block']).isRequired,
  teams: PropTypes.array,
};

PopulatedUsersList.defaultProps = {
  teams: [],
};

const GlitchTeamUsersList = ({ layout }) => {
  const GLITCH_TEAM_AVATAR = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267';
  return (
    <ul className={getContainerClass(layout)}>
      <li>
        <span className={classnames(styles.user, styles.madeByGlitch)}>
          <Avatar name="Glitch Team" src={GLITCH_TEAM_AVATAR} color="#74ecfc" type="team" />
        </span>
      </li>
    </ul>
  );
};

const UsersList = ({ glitchTeam, users, layout, teams }) => {
  if (glitchTeam) {
    return <GlitchTeamUsersList layout={layout} />;
  }
  return <PopulatedUsersList users={users} layout={layout} teams={teams} />;
};

UsersList.propTypes = {
  glitchTeam: PropTypes.bool,
};

UsersList.defaultProps = {
  glitchTeam: false,
};

export default UsersList;
