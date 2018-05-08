import PropTypes from 'prop-types';
import React from 'react';
import UsersList from "./users-list.jsx";

export default function TeamItem({team}) {
  const style = {
    backgroundImage: `url('${team.coverUrlSmall}')`,
    backgroundColor: team.coverColor,
  };
  return (
    <div className="item" style={style}>
      <div className="content">
        <img className="avatar" src={team.teamAvatarUrl} alt=""></img>
        <div className="information">
          <a href={team.url} className="button">{team.name}</a>
          {!!team.isVerified && <span data-tooltip={team.verifiedTooltip}>
            <img className="verified" src={team.verifiedImage} alt={team.verifiedTooltip} />
          </span>}
          <UsersList users={team.users} />
          {team.thanksCount > 0 && <p className="thanks">
            {team.teamThanks} <span className="emoji sparkling_heart"></span>
          </p>}
          {!!team.description && <p className="description">{team.truncatedDescription}</p>}
        </div>
      </div>
    </div>
  );
}

TeamItem.propTypes = {
  team: PropTypes.shape({
    coverColor: PropTypes.string.isRequired,
    coverUrlSmall: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    teamAvatarUrl: PropTypes.string.isRequired,
    teamThanks: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
    truncatedDescription: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    verifiedImage: PropTypes.string.isRequired,
    verifiedTooltip: PropTypes.string.isRequired,
  }),
};