import React from 'react';
import PropTypes from 'prop-types';

import { UserLink, TeamLink } from './includes/link';
import { Avatar, UserAvatar, TeamAvatar } from './includes/avatar';

// StaticUsersList

export const StaticUsersList = ({ users, extraClass }) => (
  <ul className={`users ${extraClass}`}>
    {users.map((user) => (
      <li key={user.id}>
        <span className="user">
          <UserAvatar user={user} />
        </span>
      </li>
    ))}
  </ul>
);
StaticUsersList.propTypes = {
  users: PropTypes.array.isRequired,
  extraClass: PropTypes.string,
};

StaticUsersList.defaultProps = {
  extraClass: '',
};

// UserTile

export const UserTile = ({ user }) => (
  <UserLink user={user} className="user">
    <UserAvatar user={user} />
  </UserLink>
);
UserTile.propTypes = {
  user: PropTypes.object.isRequired,
};

// PopulatedUsersList

const PopulatedUsersList = ({ users, extraClass, teams }) => {
  if (users.length) {
    return (
      <ul className={`users ${extraClass}`}>
        {users.map((user) => (
          <li key={user.id}>
            <UserLink user={user} className="user">
              <UserAvatar user={user} />
            </UserLink>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={`users ${extraClass}`}>
      {teams.map((team) => (
        <li key={team.id}>
          <TeamLink team={team} className="team">
            <TeamAvatar team={team} />
          </TeamLink>
        </li>
      ))}
    </ul>
  );
};
PopulatedUsersList.propTypes = {
  users: PropTypes.array.isRequired,
  extraClass: PropTypes.string,
  teams: PropTypes.array,
};

PopulatedUsersList.defaultProps = {
  extraClass: '',
  teams: [],
};

const GlitchTeamUsersList = ({ extraClass = '' }) => {
  const GLITCH_TEAM_AVATAR = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267';
  return (
    <ul className={`users ${extraClass}`}>
      <li>
        <span className="user made-by-glitch">
          <Avatar name="Glitch Team" src={GLITCH_TEAM_AVATAR} color="#74ecfc" type="team" />
        </span>
      </li>
    </ul>
  );
};

const UsersList = ({ glitchTeam, users, extraClass, teams }) => {
  if (glitchTeam) {
    return <GlitchTeamUsersList extraClass={extraClass} />;
  }
  return <PopulatedUsersList users={users} extraClass={extraClass} teams={teams} />;
};

UsersList.propTypes = {
  glitchTeam: PropTypes.bool,
};

UsersList.defaultProps = {
  glitchTeam: false,
};

export default UsersList;
