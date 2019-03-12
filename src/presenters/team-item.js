import PropTypes from 'prop-types';
import React from 'react';

import { getAvatarUrl, getLink, getProfileStyle } from '../models/team';

import { TeamLink } from './includes/link';
import { TruncatedMarkdown } from './includes/markdown';
import { Thanks } from './includes/thanks';
import UsersList from './users-list';
import WrappingLink from './includes/wrapping-link';
import { VerifiedBadge } from './includes/team-elements';

export default function TeamItem({ team }) {
  const style = getProfileStyle({ ...team, size: 'medium' });
  const teamThanksCount = team.users.reduce((total, { thanksCount }) => total + thanksCount, 0);
  return (
    <WrappingLink href={getLink(team)} className="item button-area" style={style}>
      <div className="content">
        <img className="avatar" src={getAvatarUrl(team)} alt="" />
        <div className="information">
          <TeamLink team={team} className="button">
            {team.name}
          </TeamLink>
          {!!team.isVerified && <VerifiedBadge />}
          <UsersList users={team.users} />
          {teamThanksCount > 0 && <Thanks count={teamThanksCount} />}
          {!!team.description && (
            <p className="description">
              <TruncatedMarkdown length={96}>{team.description}</TruncatedMarkdown>
            </p>
          )}
        </div>
      </div>
    </WrappingLink>
  );
}

TeamItem.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};
