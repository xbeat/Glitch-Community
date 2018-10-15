import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';
import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

import Notifications from '../notifications.jsx';

const ProjectSearchResults = ({projects, collection, onClick, projectName}) => (
  (projects.length > 0) ? (
    <ul className="results">
      {projects.map(project => (
        (!collection.projects.map( (project) => project.id).includes(project.id) &&
          <Notifications>
            {({createNotification}) => (
              <li key={project.id}>
                <ProjectResultItem domain={project.domain} description={project.description} users={project.users} id={project.id} isActive={false} collection={collection} action={() => onClick(project, collection, createNotification)} />
              </li>
            )}
          </Notifications>
         )
      ))}
    </ul>
  ) : 
    (projectName ? (
      <p className="results-empty">{projectName} is already in this collection <span role="img" aria-label="">💫</span></p>
      ): 
    (<p className="results-empty">nothing found <span role="img" aria-label="">💫</span></p>)
    )
);

ProjectSearchResults.propTypes = {
  collection: PropTypes.object.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  action: PropTypes.func.isRequired,
  projectName: PropTypes.sting,
};

class AddCollectionProjectPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
      maybeRequest: null, //The active request promise
      maybeResults: null, //Null means still waiting vs empty,
      projectName: '', // the project name if the search result is a Url
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
    this.onClick = this.onClick.bind(this);
  }
  
  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({ query });
    if (query) {
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }
  
  clearSearch() {
    console.log('clear search');
    this.setState({
      maybeRequest: null,
      maybeResults: null,
      projectName: '',
    });
  }
  
  async startSearch() {
    if (!this.state.query) {
      return this.clearSearch();
    }
    
    // check if the query is a URL or a name of a project
    // Project URL pattern: https://glitch.com/~power-port, https://power-port.glitch.me/, https://community.glitch.me/
    const httpsKeyword = "https://";
    const glitchKeyword = "glitch.me";
    let searchByUrl = false;
    let query = this.state.query;
    
    if(this.state.query.includes(httpsKeyword) && this.state.query.includes(glitchKeyword)){
      searchByUrl = true;
      // get project domain
      if(query.includes("me") && !query.includes("~")){
        // https://power-port.glitch.me/
        query = query.substring(query.indexOf("//")+"//".length, query.indexOf("."));
      }else if(query.includes("~") && !query.includes(".me")){
        // https://glitch.com/~power-port
        query = query.substring(query.indexOf("~")+1);
      }else if(query.includes(".me")){
        // https://community.glitch.me/
        let https = "https://";
        let http = "http://";
        if(query.includes(https)){
          query = query.substring(query.indexOf(https)+https.length, query.indexOf("."));
        }else if(query.includes(http)){
          query = query.substring(query.indexOf(http)+http.length, query.indexOf("."));
        }
      }
    }
    
    console.log(`query: ${query}`);
    const request = this.props.api.get(`projects/search?q=${query}`);
    this.setState({ maybeRequest: request });
    
    const {data} = await request;
    const results = data.map(project => ProjectModel(project).asProps());
    console.log("results %O", results);
    
    console.log("this.props.collection.projects %O", this.props.collection.projects);
    
    let nonCollectionResults = null;
    if(searchByUrl){
      let projectByDomain = results.filter(project => project.domain == query);
      console.log("projectByDomain %O", projectByDomain);
      // get names of all collectionProjects
      if(this.props.collection.projects.find(project => project.domain == query)){
        nonCollectionResults =[];
        this.setState({projectName: query});
        console.log(` set state to ${this.state.projectName} with query ${query}`);
      }else{
        nonCollectionResults = projectByDomain;
      }      
    }else{
      if(this.props.collection.projects.find(project => project.domain == query)){
        nonCollectionResults = [];
        this.setState({projectName: query});
      }else{
        nonCollectionResults = results.filter(project => !this.props.collection.projects || !this.props.collection.projects.includes(project));
      }
    }

    this.setState(({ maybeRequest }) => {
    return (request === maybeRequest) ? {
      maybeRequest: null,
      maybeResults: nonCollectionResults,
      } : {};
    });

  }
  
  onClick(project, collection, createNotification) {
    this.props.togglePopover();
    console.log(`clicked ${project.domain}`);
    
    // add project to page if successful
    this.props.addProjectToCollection(project, collection);
    
    // show notification
    createNotification(<p>Added <b><span className="project-name">{project.domain}</span></b></p>, "notifySuccess")
  }
  
  render() {
    const isLoading = (!!this.state.maybeRequest || !this.state.maybeResults);
    return (
      <dialog className="pop-over add-collection-project-pop wide-pop">
        <section className="pop-over-info">
          <input id="team-user-search" 
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query} onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Search by project name or URL"
          />
        </section>
        {!!this.state.query && <section className="pop-over-actions last-section results-list">
          {isLoading && <Loader />}
          {!!this.state.maybeResults && 
              <ProjectSearchResults projects={this.state.maybeResults} onClick={this.onClick} collection={this.props.collection} projectName={this.state.projectName}/>
          }
        </section>}
      </dialog>
    );
  }
}

AddCollectionProjectPop.propTypes = {
  api: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default AddCollectionProjectPop;