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

  onClick(event, project) {
    event.preventDefault();
    this.props.togglePopover();
    this.props.addProject(project);
  }

  sourceIsTemplates() {
    this.setState({
      source: 'templates',
      filterPlaceholder: 'Filter templates',
    });
  }

  sourceIsMyProjects() {
    this.setState({
      source: 'my-projects',
      filterPlaceholder: 'Filter projects',
    });
  }

  getTemplateProjects() {
    this.setState({
      loadingTemplates: true,
    });
    const templateIds = [
      '9cd48134-1624-48f5-beaf-6c1b68bd9217', // 'timelink'
      '712cc905-bfcb-454e-a47a-c729ab63c455', // 'poller'
      '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
    ];
    let projectsPath = `projects/byIds?ids=${templateIds.join(',')}`;
    this.props.api.get(projectsPath)
      .then(({data}) => {
        let projects = this.normalizeTemplateProjects(data);
        this.setState({
          templateProjects: projects,
          loadingTemplates: false,
        });
        this.updateFilter('');
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.source !== this.state.source) {
      this.updateFilter("");
      this.filterInput.current.focus();
    }
  }

  componentDidMount() {
    this.getTemplateProjects();
    this.filterInput.current.focus();
    this.updateFilter("");
  }
  
  filterInputIsBlank() {
    if (this.filterInput.current.value.length === 0) {
      return true;
    }
  } 

  render() {
    const filteredProjects = this.state.filteredProjects;

    return (
      <dialog className="pop-over add-team-project-pop wide-pop">
        <section className="pop-over-info">
          <input
            ref={this.filterInput}
            onChange={(event) => {this.updateFilter(event.target.value);}}
            id="team-project-search" className="pop-over-input search-input pop-over-search"
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
