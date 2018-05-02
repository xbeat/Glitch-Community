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
          <img className="avatar" src={user.userAvatarUrlLarge} alt={"@"+user.login}></img>
          <div className="information">
            {user.name ? <h3 className="name">{user.name}</h3> : null}
            <div className="button">@{user.login}</div>
            {user.thanksCount > 0 ? <p className="thanks">{user.userThanks} <span className="emoji sparkling_heart"></span></p> : null}
            {user.description ? <p className="description" dangerouslySetInnerHTML={{__html: user.truncatedDescriptionHtml}}></p> : null}
          </div>
        </div>
      </div>
    </a>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    userLink: PropTypes.string.isRequired,
    coverColor: PropTypes.string,
    coverUrlSmall: PropTypes.string.isRequired,
    description: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    userThanks: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
  }),
};