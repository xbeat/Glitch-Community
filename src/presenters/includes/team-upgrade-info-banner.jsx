import React from 'react';
import PropTypes from 'prop-types';

import UpgradeTeam from './upgrade-team.jsx';

class TeamUpgradeInfoBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    let progressPercent = Math.min(((this.props.projectsCount / this.props.limit) * 100), 100);
    let progressValueWidth = {width: progressPercent + '%'};
    let errorIfLimitReached = () => {
      if (this.props.projectsCount >= this.props.limit) {
        return 'projects-left-error';
      }
    };
    
    return (
      <aside className="inline-banners team-upgrade-banner">
        <div>
          Free teams are limited to {this.props.limit} projects
        </div>

        <div className="progress">
          <div className={`progress-value ${errorIfLimitReached()}`} style={progressValueWidth}>
            <div className={`projects-left ${errorIfLimitReached()}`}>
              {this.props.projectsCount}
            </div>
          </div>
        </div>
        
        <UpgradeTeam teamName={this.props.teamName} teamId={this.props.teamId} currentUserId={this.props.currentUserId} users={this.props.users}/>
      </aside>
    );
  }
}

TeamUpgradeInfoBanner.propTypes = {
  projectsCount: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
};

export default TeamUpgradeInfoBanner;
