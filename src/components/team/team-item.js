import PropTypes from 'prop-types';
import React from 'react';
import { sumBy } from 'lodash';

import Button from 'Components/buttons/button';
import Markdown from 'Components/text/markdown';
import Cover from 'Components/blocks/cover';
import Image from 'Components/images/image';
import { StaticUsersList } from 'Components/user/users-list';
import { getAvatarUrl, DEFAULT_TEAM_AVATAR } from 'Models/team';
import { TeamLink } from '../../presenters/includes/link';
import { VerifiedBadge } from '../../presenters/includes/team-elements';
import { Thanks } from '../../presenters/includes/thanks';


import styles from './team-item.styl';

const ProfileAvatar = ({ team }) => <Image className={styles.avatar} src={getAvatarUrl(team)} defaultSrc={DEFAULT_TEAM_AVATAR} alt="" />;

const getTeamThanksCount = (team) => sumBy(team.users, (user) => user.thanksCount);

const TeamItem = ({ team }) => (
  <TeamLink className={styles.container} team={team}>
    <Cover type="team" item={team} size="medium" />
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
          <div className={styles.usersList}>
            <StaticUsersList users={team.users} layout="block" />
          </div>
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
