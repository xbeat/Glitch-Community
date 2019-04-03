import PropTypes from 'prop-types';
import React from 'react';
import { sum } from 'lodash';

import Button from 'Components/buttons/button';
import Markdown from 'Components/text/markdown';
import { getAvatarUrl, getProfileStyle } from '../../models/team';
import { TeamLink } from '../../presenters/includes/link';
import { VerifiedBadge } from '../../presenters/includes/team-elements';
import { Thanks } from '../../presenters/includes/thanks';
import UsersList from '../../presenters/users-list';

import styles from './team-item.styl';

const Cover = ({ team, size }) => <div className="cover" style={getProfileStyle({ ...team, size })} />;

const ProfileAvatar = ({ team }) => <img className="avatar" src={getAvatarUrl(team)} alt="" />;

const getTeamThanksCount = (team) => sum(team.users, (user) => user.thanksCount);

const TeamItem = ({ team }) => (
  <TeamLink className={styles.container} team={team}>
    <Cover team={team} size="medium" />
    <div className={styles.innerWrap}>
      <div className={styles.mainContent}>
        <div className={styles.avatarWrap}>
          <ProfileAvatar team={team} />
        </div>
        <div className={styles.body}>
          <div>
            <Button decorative>{team.name}</Button>
            {!!team.isVerified && <VerifiedBadge />}
          </div>
          <UsersList users={team.users} />
          <Markdown length={96}>{team.description || ' '}</Markdown>
        </div>
      </div>
      <Thanks count={getTeamThanksCount(team)} />
    </div>
  </TeamLink>
);

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

export default TeamItem;
