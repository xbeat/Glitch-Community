import React from 'react';
import PropTypes from 'prop-types';

import {CurrentUserConsumer} from '../current-user.jsx';

export class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    
    this.onClick = this.onClick.bind(this);
  }

  onClick(event, report) {
    event.preventDefault();
    this.props.togglePopover();
    this.props.reportAbuse(report);
  }


  render() { 
    return (
      <dialog className="pop-over wide-pop">
        <section className="pop-over-info">
          <input
            id="team-project-search" className="pop-over-input"
            placeholder= {this.state.filterPlaceholder}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>

        <section className="pop-over-actions results-list" data-source='templates'>
          <ul className="results">
            { filteredProjects.map((project) => (
              <li key={project.id}>
                <ProjectResultItem
                  action={(event) => this.onClick(event, project)}
                  {...project}
                  title={project.domain}
                  isPrivate={project.private}
                />
              </li>
            ))}
          </ul>
          { (this.state.filteredProjects.length === 0 && this.filterInputIsBlank) &&
             <p className="action-description no-projects-description">Create or Join projects to add them to the team</p>
          }
        </section>
      </dialog>
    );
  }
}

ReportAbusePop.propTypes = {
  api: PropTypes.any.isRequired
};

const ReportAbusePopContainer = (props) => (
  <CurrentUserConsumer>
    {currentUser => <ReportAbusePop currentUser={currentUser} {...props}/>}
  </CurrentUserConsumer>
);

export default ReportAbusePopContainer;
