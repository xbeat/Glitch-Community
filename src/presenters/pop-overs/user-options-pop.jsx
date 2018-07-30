import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';

const TeamButton = ({url, name, teamAvatarUrl}) => (
  <a className="button-link" href={`/@${url}`}>
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
};

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
};



const UserOptionsPop = ({togglePopover, userLink, avatarUrl, avatarStyle, teams, showNewStuffOverlay}) => {
  const clickNewStuff = (event) => {
    togglePopover();
    showNewStuffOverlay();
    event.stopPropagation();
  };
  
  const signOut = () => {
    /* global analytics */
    analytics.track("Logout");
    analytics.reset();
    localStorage.removeItem('cachedUser');
    return location.reload();
  };

  return (
    <dialog className="pop-over user-options-pop">
      <section className="pop-over-actions">
        <a className="button-link" href={userLink}>
          <div className="button button-small has-emoji button-tertiary">
            <span>Your Profile </span>
            <img className="emoji avatar" src={avatarUrl} style={avatarStyle} alt="Your avatar"></img>
          </div>
        </a>
      </section>

      <TeamButtons teams={teams}/>

      <section className="pop-over-info section-has-tertiary-buttons">      
        <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={clickNewStuff}>
          <span>New Stuff </span>
          <span className="emoji dog-face"></span>
        </button>
        <a className="button-link" href="https://support.glitch.com">
          <div className="button button-small has-emoji button-tertiary button-on-secondary-background">
            <span>Support </span>
            <span className="emoji ambulance"></span>
          </div>
        </a>        
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
  userLink: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

export default function UserOptionsPopContainer(props) {
  const {avatarUrl, avatarStyle} = props;
  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <div className="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true">
          <button className="user" onClick={togglePopover}>
            <img src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options"/>
            <span className="down-arrow icon"/>
          </button>
          {visible && <UserOptionsPop {...props} togglePopover={togglePopover}/>}
        </div>
      )}
    </PopoverContainer>
  );
}
          
UserOptionsPopContainer.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
};
