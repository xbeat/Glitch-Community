import React from 'react';
import PropTypes from 'prop-types';

import UpgradeTeam from './upgrade-team.jsx';

class TeamUpgradeInfoBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingFreeProjects: 0,
    };
    this.updateRemainingFreeProjects = this.updateRemainingFreeProjects.bind(this);
    this.errorIfLimitReached = this.errorIfLimitReached.bind(this);
  }

  updateRemainingFreeProjects() {
    let remaining = this.props.limit - this.props.projectsCount;
    if (remaining < 0) {
      remaining = 0;
    }
    this.setState({
      remainingFreeProjects: remaining
    });
  }
  
  errorIfLimitReached() {
    if (this.state.remainingFreeProjects === 0) {
      return 'projects-left-error';
    }
  }

  componentDidMount() {
    this.updateRemainingFreeProjects();
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.projectsCount !== prevProps.projectsCount) {
      this.updateRemainingFreeProjects();
    }
  }

  render() {
    let progressValueWidth = () => {
      return {width: (this.props.projectsCount / this.props.limit) * 100}
    }
    
    return (
      <aside className="inline-banners team-upgrade-banner">
        <div>
          Free teams are limited to 5 projects
        </div>

        <div className="progress" value={this.props.projectsCount} max={this.props.limit}>
          <div className="progress-value" style={progressValueWidth}>
            <div className={`projects-left ${this.errorIfLimitReached()}`}>
              {this.state.remainingFreeProjects} left
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
