import React from 'react';
import PropTypes from 'prop-types';

import {TeamLink} from './includes/link.jsx';
import {getAvatarUrl} from '../models/team';

export const TeamsList = ({teams}) => (
  <ul className="users">
    {teams.map(team => (
      <li key={team.id}>
        <TeamLink team={team} className="user" data-tooltip={team.name} data-tooltip-left="true">
          <img className="user-list-avatar" src={getAvatarUrl({...team, size:'small'})} alt={team.name} width="32px" height="32px"/>
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