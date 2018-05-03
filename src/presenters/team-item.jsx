import UsersList from "./users-list.jsx";
import PropTypes from 'prop-types';
import React from 'react';

export function TeamItemPresenter(application, team) {

  var self = {
    application,
    team,

    name() {
      return team.name();
    },

    truncatedDescription() {
      return team.truncatedDescription();
    },

    thanks() {
      return team.teamThanks();
    },
    
    users() {
      return team.users();
    },

    hiddenUnlessThanks() {
      if (!(team.thanksCount() > 0)) { return 'hidden'; }
    },
    
    hiddenUnlessDescription() {
      if (!team.description()) { return 'hidden'; }
    },

    style() {
      return {
        backgroundImage: `url('${self.coverUrl()}')`,
        backgroundColor: self.coverColor(),
      };
    },
  };

  return self;
}

export default function TeamItem({team}) {
  const style = {
    backgroundImage: `url('${team.coverUrlSmall}')`,
    backgroundColor: team.coverColor,
  };
  return (
    <a href={team.url}>
      <div className="item" style={style}>
        <div className="content">
          <img className="avatar" src={team.teamAvatarUrl} alt=""></img>
          <div className="information">
            <div className="button">{team.name}</div>
            {!!team.isVerified && <span data-tooltip={team.verifiedTooltip}>
              <img className="verified" src={team.verifiedImage} alt={team.verifiedTooltip} />
            </span>}
            <UsersList users={team.users} />
          </div>
        </div>
      </div>
    </a>
  );
}
TeamItem.propTypes = {
  team: PropTypes.shape({
    coverColor: PropTypes.string.isRequired,
    coverUrlSmall: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    teamAvatarUrl: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    verifiedImage: PropTypes.string.isRequired,
    verifiedTooltip: PropTypes.string.isRequired,
  }),
};
/*
li
  a(href=@url)
    .item(@style)
      .content
        img.avatar(src=@avatarUrl alt=@name)
        .information
          .button
            span= @name
          span(data-tooltip=@verifiedTeamTooltip)
            img.verified(src=@verifiedImage class=@hiddenUnlessVerified)

          = @UsersList
          p.thanks(class=@hiddenUnlessThanks)= @thanks
            span.emoji.sparkling_heart
          p.description(class=@hiddenUnlessDescription)= @truncatedDescription
*/