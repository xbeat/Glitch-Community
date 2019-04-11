import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Avatar, UserAvatar, TeamAvatar } from 'Components/images/avatar';
import styles from './profile-list.styl';

const getContainerClass = (layout) => classnames(styles.container, styles[layout]);

const PopulatedProfileList = ({ users, teams, layout, hasLinks }) => (
  <ul className={getContainerClass(layout)}>
    {users.map(user => (
      <li key={`user-${user.id}`} className={styles.listItem}>
        <UserItem user={user} hasLinks={hasLinks} />
      </li>
    ))}
  </ul>
)