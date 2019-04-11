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

const useResizeObserver = () => {
  const ref = useRef()
  useEffect
})

const RowContainer = ({ layout, items }) => {};

const PopulatedProfileList = ({ users, teams, layout, hasLinks }) => {
  const items = [
    ...teams.map((team) => (
      <li key={`team-${team.id}`} className={styles.listItem}>
        <TeamItem team={team} hasLinks={hasLinks} />
      </li>
    )),
    ...users.map((user) => (
      <li key={`user-${user.id}`} className={styles.listItem}>
        <UserItem user={user} hasLinks={hasLinks} />
      </li>
    )),
  ];

  // if (layout === "row") {
  //   return <RowContainer items={items} />
  // }

  return <ul className={getContainerClass(layout)}>{items}</ul>;
};

const GLITCH_TEAM_AVATAR = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267';

const GlitchTeamList = () => (
  <ul className={styles.container}>
    <li className={styles.listItem}>
      <Avatar name="Glitch Team" src={GLITCH_TEAM_AVATAR} color="#74ecfc" type="team" />
    </li>
  </ul>
);

const PlaceholderList = () => (
  <ul className={styles.container}>
    <li className={styles.listItem}>
      <div className={styles.placeholder} />
    </li>
  </ul>
);

const maybeList = (item) => (item ? [item] : []);

export const ProfileItem = ({ user, team, hasLinks, glitchTeam }) => (
  <ProfileList layout="spaced" users={maybeList(user)} teams={maybeList(team)} hasLinks={hasLinks} glitchTeam={glitchTeam} />
);

const ProfileList = ({ users, teams, layout, hasLinks, glitchTeam }) => {
  if (glitchTeam) {
    return <GlitchTeamList />;
  }

  if (!users.length && !teams.length) {
    return <PlaceholderList />;
  }

  return <PopulatedProfileList users={users} teams={teams} layout={layout} hasLinks={hasLinks} />;
};

ProfileList.propTypes = {
  layout: PropTypes.oneOf(['row', 'block', 'spaced']).isRequired,
  users: PropTypes.array,
  teams: PropTypes.array,
  glitchTeam: PropTypes.bool,
  hasLinks: PropTypes.bool,
};

ProfileList.defaultProps = {
  users: [],
  teams: [],
  glitchTeam: false,
  hasLinks: false,
};

export default ProfileList;
(