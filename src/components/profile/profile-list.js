import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Avatar, UserAvatar, TeamAvatar } from 'Components/images/avatar';

import { UserLink, TeamLink } from '../../presenters/includes/link';

import styles from './profile-list.styl';

const getContainerClass = (layout) => classnames(styles.container, styles[layout]);

const UserItem = ({ user, hasLinks }) =>
  hasLinks ? (
    <UserLink user={user}>
      <UserAvatar user={user} />
    </UserLink>
  ) : (
    <UserAvatar user={user} />
  );

const TeamItem = ({ team, hasLinks }) =>
  hasLinks ? (
    <TeamLink team={team}>
      <TeamAvatar team={team} />
    </TeamLink>
  ) : (
    <TeamAvatar team={team} />
  );

const PopulatedProfileList = ({ users, teams, layout, hasLinks }) => (
  <ul className={getContainerClass(layout)}>
    {teams.map((team) => (
      <li key={`team-${team.id}`} className={styles.listItem}>
        <TeamItem team={team} hasLinks={hasLinks} />
      </li>
    ))}
    {users.map((user) => (
      <li key={`user-${user.id}`} className={styles.listItem}>
        <UserItem user={user} hasLinks={hasLinks} />
      </li>
    ))}
  </ul>
);

const GLITCH_TEAM_AVATAR = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267';

const GlitchTeamUsersList = () => (
  <ul className={styles.container}>
    <li className={styles.listItem}>
      <Avatar name="Glitch Team" src={GLITCH_TEAM_AVATAR} color="#74ecfc" type="team" />
    </li>
  </ul>
);

const PlaceholderUsersList = () => (
  <ul className={styles.container}>
    <li className={styles.listItem}>
      <div className={styles.placeholder} />
    </li>
  </ul>
);

const ProfileList = ({ users, teams, layout, hasLinks, glitchTeam }) => {
  if (glitchTeam) {
    return <GlitchTeamUsersList />;
  }

  if (!users.length && !teams.length) {
    return <PlaceholderUsersList />;
  }

  return <PopulatedUsersList users={users} teams={teams} layout={layout} hasLinks={hasLinks} />;
};

ProfileList.propTypes = {
  users: PropTypes.array,
  teams: PropTypes.array,
  layout: PropTypes.oneOf(['row', 'block', 'blockSpaced']),
}

export default ProfileList;