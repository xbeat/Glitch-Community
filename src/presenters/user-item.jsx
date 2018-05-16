import PropTypes from 'prop-types';
import React from 'react';
import Thanks from './includes/thanks.jsx';

function addDefaultSrc(event) {
  const AnonAvatarUrl = "https://cdn.glitch.com/f6949da2-781d-4fd5-81e6-1fdd56350165%2Fanon-user-on-project-avatar.svg";
  event.target.src = AnonAvatarUrl;
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
  }),
};