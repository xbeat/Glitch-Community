import React from 'react';
import PropTypes from 'prop-types';

import {TeamLink} from './includes/link.jsx';
import {TeamAvatar} from './includes/avatar.jsx';

export const TeamsList = ({teams}) => (
  <ul className="users teams-information">
    {teams.map(team => (
      <li key={team.id}>
        <TeamLink team={team} className="user" data-tooltip={team.name} data-tooltip-left="true">
          <TeamAvatar team={team}/>
        </TeamLink>
      </li>
    ))}
  </ul>
);

TeamsList.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })),
};

export default TeamsList;