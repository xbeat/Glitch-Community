import PropTypes from 'prop-types';
import React from 'react';

export default function UserItem({user}) {
  const style = {
    backgroundImage: `url('${user.coverUrlSmall}')`,
    backgroundColor: user.coverColor || '',
  };
  return (
    <a href={user.userLink}>
      <div className="item" style={style}>
        <div className="content">
          <img className="avatar" src={user.userAvatarUrlLarge} alt=""></img>
          <div className="information">
            {!!user.name && <h3 className="name">{user.name}</h3>}
            <div className="button">@{user.login}</div>
            {user.thanksCount > 0 && <p className="thanks">{user.userThanks} <span className="emoji sparkling_heart"></span></p>}
            {!!user.description && <p className="description" dangerouslySetInnerHTML={{__html: user.truncatedDescriptionHtml}}></p>}
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
    truncatedDescriptionHtml: PropTypes.string,
    userLink: PropTypes.string.isRequired,
    userThanks: PropTypes.string.isRequired,
  }),
};