import PropTypes from 'prop-types';
import React from 'react';

import Button from 'Components/buttons/button';
import Markdown from 'Components/text/markdown';
import Image from 'Components/images/image';
import { getAvatarUrl, getLink, getProfileStyle } from '../models/team';

import { Thanks } from './includes/thanks';
import UsersList from './users-list';
import WrappingLink from './includes/wrapping-link';
import { VerifiedBadge } from './includes/team-elements';

export default function TeamItem({ team }) {
  const style = getProfileStyle({ ...team, size: 'medium' });
  const teamThanksCount = team.users.reduce((total, { thanksCount }) => total + thanksCount, 0);
  return (
    <WrappingLink href={getLink(team)} className="item button-area">
      <>
        <div className="cover" style={style} />
        <div className="content">
          <Image className="avatar" src={getAvatarUrl(team)} alt="" />
          <div className="information">
            <Button href={getLink(team)}>{team.name}</Button>
            {!!team.isVerified && <VerifiedBadge />}
            <UsersList users={team.users} />
            {!!team.description && (
              <p className="description">
                <Markdown length={96}>{team.description}</Markdown>
              </p>
            )}
            {teamThanksCount > 0 && <Thanks count={teamThanksCount} />}
          </div>
        </div>
      </>
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
