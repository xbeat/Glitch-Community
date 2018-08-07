import React from 'react';
import PropTypes from 'prop-types';

export const TeamMarketing = () => {
  const forPlatformsIcon = 'https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188';
  return (
    <section className="team-marketing">
      <p>
        <img className="for-platforms-icon" src={forPlatformsIcon} alt="fishing emoji"></img>
        <span>Want your own team page, complete with detailed app analytics?</span>
      </p>
      <a href="https://glitch.com/forteams">
        <button className="button has-emoji">
          About Teams 
          <span className="emoji fishing_pole" role="img" aria-label="emoji" />
        </button>
      </a>
    </section>
  );
};

export const VerifiedBadge = () => {
  const image = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fverified.svg?1501783108220';
  const tooltip = 'Verified to be supportive, helpful people';
  return (
    <span data-tooltip={tooltip}>
      <img className="verified" src={image} alt={tooltip}/>
    </span>
  );
};

//temp
export const AdminOnlyBadge = ({...props}) => {
  return (
    <React.Fragment>
      { (props.currentUserIsTeamAdmin === false) && 
        <div className="status-badge">
          <span className="status admin">Admin</span>
        </div> 
      }
    </React.Fragment>
  );
};

AdminOnlyBadge.propTypes = {
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
};
