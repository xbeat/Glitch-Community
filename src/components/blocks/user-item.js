import PropTypes from 'prop-types';
import React from 'react';

import Button from 'Components/buttons/button';
import Markdown from 'Components/text/markdown';
import Image from 'Components/images/image';

import { UserLink } from '../../presenters/includes/link';
import { Thanks } from '../../presenters/includes/thanks';

import { getProfileStyle } from '../../models/user';

import styles from './user-item.styl';

const Cover = ({ user, size }) => <div className="cover" style={getProfileStyle({ ...user, size })} />;

const UserAvatar = () => {

}

const NameAndLogin = ({ user }) =>
  user.name ? (
    <>
      <Button decorative>{user.name}</Button>
      <p className={user}>@{user.login}</p>
    </>
  ) : (
    <Button decorative>@{user.login}</Button>
  );

const UserItem = ({ user }) => (
  <UserLink className={styles.container} user={user}>
    <Cover user={user} size="medium" />
    <div className={styles.header}>
      <UserAvatar user={user} />
      <NameAndLogin user={user} />
    </div>
    <div className={styles.body}>
      <Markdown length={96}>{user.description || ' '}</Markdown>
      {user.thanksCount > 0 && <Thanks count={user.thanksCount} />}
    </div>
  </UserLink>
);

UserItem.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverColor: PropTypes.string,
    description: PropTypes.string,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string.isRequired,
    name: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default UserItem;
