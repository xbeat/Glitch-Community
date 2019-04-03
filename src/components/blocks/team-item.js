import PropTypes from 'prop-types';
import React, { useRef, useLayoutEffect } from 'react';
import { sumBy } from 'lodash';

import Button from 'Components/buttons/button';
import Markdown from 'Components/text/markdown';
import Cover from 'Components/blocks/cover';
import Image from 'Components/images/image';
import { getAvatarUrl, DEFAULT_TEAM_AVATAR } from '../../models/team';
import { TeamLink } from '../../presenters/includes/link';
import { VerifiedBadge } from '../../presenters/includes/team-elements';
import { Thanks } from '../../presenters/includes/thanks';
import UsersList from '../../presenters/users-list';

import styles from './team-item.styl';

const ProfileAvatar = ({ team }) => <Image className={styles.avatar} src={getAvatarUrl(team)} defaultSrc={DEFAULT_TEAM_AVATAR} alt="" />;

const getTeamThanksCount = (team) => sumBy(team.users, (user) => user.thanksCount);

const useAbsolutePositioning = () => {
  const target = useRef()
  const contents = useRef()
  useLayoutEffect(() => {
    
  }, [])
  return { target, contents }
}

const TeamItem = ({ team }) => {
  const { target, contents } = useAbsolutePositioning()
  return (
  <div style={{ position: 'relative' }}>
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
            <div ref={target} />
            <Markdown length={96}>{team.description || ' '}</Markdown>
          </div>
        </div>
        <Thanks count={getTeamThanksCount(team)} />
      </div>
    </TeamLink>
    <div ref={contents}>
      <UsersList users={team.users}/>
    </div>
  </div>
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

export default TeamItem;
