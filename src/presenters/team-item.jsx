import PropTypes from 'prop-types';
import React from 'react';
import UsersList from "./users-list.jsx";

export function TeamItemPresenter(application, team) {

  var self = {
    application,
    team,

    truncatedDescription() {
      return team.truncatedDescription();
    },
    
    hiddenUnlessDescription() {
      if (!team.description()) { return 'hidden'; }
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
            {team.thanksCount > 0 && <p className="thanks">
              {team.teamThanks} <span className="emoji sparkling_heart"></span>
            </p>}
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
    teamThanks: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
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