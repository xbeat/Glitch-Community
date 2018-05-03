import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
const { CancelToken } = axios;
const source = CancelToken.source();

import ProjectResultItem from '../includes/project-result-item.jsx';
import Loader from '../includes/loader.jsx';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project.js';

export class AddTeamProjectPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearching: false,
      searchResults: [],
    };
    
    this.searchProjects = debounce(this.searchProjects, 400);
  }
  searchProjects(query) {
    if(!query) {
      return;
    }
    this.setState({isSearching: true});
    this.props.api(source).get(`projects/search?q=${query}`)
      .then(({data}) => {
        this.setState({isSearching: false});
        const projects = data.map((project) => {
          let projectProps = ProjectModel(project).asProps();
          Object.assign(projectProps, {
            action: this.props.action,
            title: projectProps.domain
          });
          return projectProps;
        });
        this.setState({searchResults: projects});
      });
  }
  
  
  render() {
    return (
      <dialog className="pop-over add-team-project-pop">
        <section className="pop-over-info">
          <input onChange={(event) => {this.searchProjects(event.target.value);}} id="team-project-search" className="pop-over-input search-input pop-over-search" placeholder="Search for a project" />
        </section>
        <section className="pop-over-actions results-list">
          { this.state.isSearching && <Loader /> }
          <ul className="results">
            { this.state.searchResults.map((project, key) => (
              <ProjectResultItem key={key} {...project}/>
            ))}
          </ul>
        </section>
      </dialog>
    );
  }
}

AddTeamProjectPop.propTypes = {
  api: PropTypes.func.isRequired,
  teamUsers: PropTypes.array.isRequired,
  action: PropTypes.func.isRequired,
};


export default AddTeamProjectPop;
