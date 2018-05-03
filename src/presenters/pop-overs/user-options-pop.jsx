import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container';

const TeamButton = ({url, name, teamAvatarUrl}) => (
  <a className="button-link" href={url}>
    <div className="button button-small has-emoji button-tertiary">
      <span>{name} </span>
      <img className="emoji avatar" src={teamAvatarUrl} alt={`${name} team avatar`} width="16px" height="16px"/>
    </div>
  </a>
);

TeamButton.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  teamAvatarUrl: PropTypes.string.isRequired,
}

const TeamButtons = ({teams}) => {
  const hasTeams = teams && teams.length;
  if(!hasTeams) {
    return null;
  }
  
  return (
    <section className="pop-over-actions">
      {teams.map((team) => (
        <TeamButton key={team.name} {...team}/>
      ))}
    </section>
  );
};

TeamButtons.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
}

const UserOptionsPop = ({togglePopover, profileLink, avatarUrl, teams, showNewStuffOverlay, signOut}) => {
  const clickNewStuff = (event) => {
    togglePopover();
    showNewStuffOverlay();
    event.stopPropagation();
  };

  return (
    <dialog className="pop-over user-options-pop">
      <section className="pop-over-actions">
        <a className="button-link" href={profileLink}>
          <div className="button button-small has-emoji button-tertiary">
            <span>Your Profile </span>
            <img className="emoji avatar" src={avatarUrl} alt="Your avatar"></img>
          </div>
        </a>

        <button className="button-small has-emoji button-tertiary" onClick={clickNewStuff}>
          <span>New Stuff </span>
          <span className="emoji dog-face"></span>
        </button>
        
        <a className="button-link" href="https://support.glitch.com">
          <div className="button button-small has-emoji button-tertiary">
            <span>Support </span>
            <span className="emoji ambulance"></span>
          </div>
        </a>        
      </section>

      <TeamButtons teams={teams}/>

      <section className="pop-over-info last-section section-has-tertiary-buttons">
        <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={signOut}>
          <span>Sign Out</span>
          <span className="emoji balloon"></span>
        </button>
      </section>
    </dialog>
  );
};

UserOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  profileLink: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default function UserOptionsPopContainer(props) {
  return (
    <div className="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true"
    <UserOptionsPop {...props}/>
  );
}
.button.user-options-pop-button.opens-pop-over(class=@hiddenUnlessSignedIn data-tooltip="User options" data-tooltip-right=true)
      button.user(click=@toggleUserOptionsPopVisible)
        img(src=@userAvatar width=30 height=30 alt="User options")
        span.down-arrow.icon


export default UserOptionsPop;