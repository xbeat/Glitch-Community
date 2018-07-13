import React from 'react';
import PropTypes from 'prop-types';

import UpgradeTeam from './upgrade-team.jsx';



class TeamUpgradeBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingFreeProjects: 0,
    };
    this.updateRemainingFreeProjects = this.updateRemainingFreeProjects.bind(this);
  }

  updateRemainingFreeProjects() {
    let remaining = this.props.limit - this.props.projectsCount
    if (remaining < 0) {
      remaining = 0
    }
    this.setState({
      remainingFreeProjects: remaining
    })
  }

  componentDidMount() {
    this.updateRemainingFreeProjects()
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.projectsCount !== prevProps.projectsCount) {
      this.updateRemainingFreeProjects()
    }
  }

  render() {
    return (
      <aside className="inline-banners team-upgrade-banner">
        <div>
          Free teams are limited to 5 projects
        </div>
        <div className="projects-left">
          {this.state.remainingFreeProjects} left
        </div>
        <progress value={this.props.projectsCount} max={this.props.limit} />
        <UpgradeTeam teamName={this.props.teamName} teamId={this.props.teamId} currentUserId={this.props.currentUserId} />
      </aside>
    );
  }
};

TeamUpgradeBanner.propTypes = {
  projectsCount: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number.isRequired,
};

export default TeamUpgradeBanner;
