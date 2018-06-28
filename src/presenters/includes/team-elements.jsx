import React from 'react';
import PropTypes from 'prop-types';

export const TeamMarketing = () => (
  <section className="team-marketing">
    <p>
      <img className="for-platforms-icon" src="https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188" alt="fishing emoji"></img>
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

export const VerifiedBadge = ({image, tooltip}) => (
  <span data-tooltip={tooltip}>
    <img className="verified" src={image} alt={tooltip}/>
  </span>
);
VerifiedBadge.propTypes = {
  image: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};
