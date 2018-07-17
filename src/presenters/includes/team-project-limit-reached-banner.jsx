import React from 'react';
import PropTypes from 'prop-types';

import UpgradeTeam from './upgrade-team.jsx';

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
        <UpgradeTeam teamName={this.props.teamName} teamId={this.props.teamId} currentUserId={this.props.currentUserId} users={this.props.users} />
      </aside>
    );
  }
}

TeamProjectLimitReachedBanner.propTypes = {
  teamName: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
};

export default TeamProjectLimitReachedBanner;
