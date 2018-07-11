import React from 'react';
import PropTypes from 'prop-types';

// import PopoverContainer from '../pop-overs/popover-container.jsx'; // see delete-team for pop pattern


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
      <aside className="team-upgrade-banner">
        <p>Free teams are limited to 5 projects</p>
        <progress value={this.props.projectsCount} max={this.props.limit} />
        <p className="secondary">{this.state.remainingFreeProjects} left</p>
        <button className="button buttom-small has-emoji">
          Upgrade Team
          <span className="emoji fish" />
        </button>
      </aside>
    );
  }
};

TeamUpgradeBanner.propTypes = {
  projectsCount: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
};

export default TeamUpgradeBanner;
