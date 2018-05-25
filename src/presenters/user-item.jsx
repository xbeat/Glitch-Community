import PropTypes from 'prop-types';
import React from 'react';
import {TruncatedMarkdown} from './includes/markdown.jsx';
import Thanks from './includes/thanks.jsx';

import {ANON_AVATAR_URL} from '../models/user.js';

function addDefaultSrc(event) {
  event.target.src = ANON_AVATAR_URL;
}

export default function UserItem({user}) {
  const style = {
    backgroundImage: `url('${user.coverUrlSmall}')`,
    backgroundColor: user.coverColor || '',
  };
  return (
    <a href={user.userLink}>
      <div className="item" style={style}>
        <div className="content">
          <img onError={addDefaultSrc} className="avatar" src={user.userAvatarUrlLarge} alt=""></img>
          <div className="information">
            {!!user.name && <h3 className="name">{user.name}</h3>}
            <div className="button">@{user.login}</div>
            {user.thanksCount > 0 && <Thanks count={user.thanksCount} />}
            {!!user.description && <p className="description"><TruncatedMarkdown length={96}>{user.description}</TruncatedMarkdown></p>}
          </div>
        </div>
      </div>
    </a>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    coverColor: PropTypes.string,
    coverUrlSmall: PropTypes.string.isRequired,
    description: PropTypes.string,
    login: PropTypes.string.isRequired,
    name: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    userLink: PropTypes.string.isRequired,
  }),
};