import React from 'react';
import PropTypes from 'prop-types';

// import PopoverContainer from '../pop-overs/popover-container.jsx'; // see delete-team for pop pattern


class TeamProjectLimitReachedBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <aside className="inline-banners team-project-limit-reached-banner">
        <div className="description">
          You'll need to upgrade your team to add more projects
        </div>
        <button className="button buttom-small button-cta has-emoji">
          <span>Upgrade {this.props.teamName} </span>
          <span className="emoji sparkles" />
        </button>
      </aside>
    );
  }
};

TeamProjectLimitReachedBanner.propTypes = {
  teamName: PropTypes.string.isRequired,
};

export default TeamProjectLimitReachedBanner;
