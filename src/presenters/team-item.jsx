import PropTypes from 'prop-types';
import React from 'react';
import {TruncatedMarkdown} from './includes/markdown.jsx';
import Thanks from './includes/thanks.jsx';
import UsersList from './users-list.jsx';
import WrappingLink from './includes/wrapping-link.jsx';

export default function TeamItem({team}) {
  const style = {
    backgroundImage: `url('${team.coverUrlSmall}')`,
    backgroundColor: team.coverColor,
  };
  return (
    <WrappingLink href={team.url} className="item" style={style}>
      <div className="content">
        <img className="avatar" src={team.teamAvatarUrl} alt="" />
        <div className="information">
          <a href={team.url} className="button">{team.name}</a>
          {!!team.isVerified && <span data-tooltip={team.verifiedTooltip}>
            <img className="verified" src={team.verifiedImage} alt={team.verifiedTooltip} />
          </span>}
          <UsersList users={team.users} />
          {team.thanksCount > 0 && <Thanks count={team.thanksCount} />}
          {!!team.description && <p className="description"><TruncatedMarkdown length={96}>{team.description}</TruncatedMarkdown></p>}
        </div>
      </div>
    </WrappingLink>
  );
}

TeamItem.propTypes = {
  team: PropTypes.shape({
    coverColor: PropTypes.string.isRequired,
    coverUrlSmall: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    teamAvatarUrl: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
    users: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    verifiedImage: PropTypes.string.isRequired,
    verifiedTooltip: PropTypes.string.isRequired,
  }),
};