import PropTypes from 'prop-types';
import React from 'react';

export function UserItemPresenter(application, user) {
  var self = {
    application,
    user,

    login() {
      return `@${user.login()}`;
    },

    name() {
      return user.name();
    },

    truncatedDescription() {
      return user.truncatedDescriptionMarkdown();
    },

    thanks() {
      return user.userThanks();
    },
    hiddenUnlessThanks() {
      if (!(user.thanksCount() > 0)) { return 'hidden'; }
    },
    
    hiddenUnlessDescription() {
      if (!user.description()) { return 'hidden'; }
    },
    
    hiddenUnlessName() {
      if (!user.name()) { return 'hidden'; }
    },
  };
}

export default function UserItem({user}) {
  const style = {
    backgroundImage: `url('${user.coverUrlSmall}')`,
    //backgroundColor: user.coverColor,
  };
  return (
    <a href={user.userLink}>
      <div className="item" style={style}>
        <div className="content">
          <img className="avatar" src={user.userAvatarUrlLarge} alt={"@"+user.login}></img>
          <div className="information">
            <h3 className="name @hiddenUnlessName">{user.name}</h3>
            <div className="button">@{user.login}</div>
            <p className="thanks @hiddenUnlessThanks">@thanks <span className="emoji sparkling_heart"></span></p>
            <p className="description @hiddenUnlessDescription">@truncatedDescription</p>
          </div>
        </div>
      </div>
    </a>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    userLink: PropTypes.string.isRequired,
    //coverColor: PropTypes.string.isRequired,
    coverUrlSmall: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
  }),
};